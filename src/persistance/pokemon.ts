import { ISqlite } from "sqlite";
import { Statement } from "sqlite3";
import connectDB from "../config/db";
import { Pokemon, Row } from "../interfaces/pokemonInterface";
import { getCurrentQuery } from "../utils/getQuerys";
import { lengthIsEqual, validateChanges } from "../utils/validations";

export const getAllPokemons = async () => {
  try {
    const db = await connectDB();

    const data = await db?.all<Row[]>("SELECT * FROM pokemons");

    db?.close();

    return { success: true, status: 200, data };
  } catch (error: unknown) {
    return { success: false, status: 500, error: error };
  }
};

export const getPokemonById = async (id: string) => {
  try {
    const db = await connectDB();

    const data = await db?.all<Row[]>(
      `SELECT * FROM pokemons WHERE id = ${id}`
    );

    db?.close();

    return data?.length === 0
      ? {
          success: false,
          status: 400,
          error: "No existe ningun Pokemon con esta ID",
        }
      : { success: true, status: 200, data };
  } catch (error: unknown) {
    return { success: false, status: 500, error: error };
  }
};

export const getPokemonBy = async (type: string, customData: string) => {
  const currentQuery = getCurrentQuery(type);
  try {
    const db = await connectDB();

    const data = await db?.all(currentQuery, customData);

    db?.close();

    return data?.length === 0
      ? {
          success: false,
          status: 400,
          error: "No se ha encontrado ningun Pokemon",
        }
      : { success: true, status: 200, data };
  } catch (error: unknown) {
    return { success: false, status: 500, error: error };
  }
};

export const addPokemon = async (pokemonData: Pokemon) => {
  try {
    const db = await connectDB();

    const newTable = await db?.run(`INSERT INTO pokemons (type, name)
    VALUES ('${pokemonData.type}', '${pokemonData.name}')`);

    await db?.close();

    return { success: true, status: 200, data: newTable };
  } catch (error) {
    return { success: false, status: 500, error: error };
  }
};

export const updatePokemon = async (
  updatedPokemonData: Pokemon,
  id: string
) => {
  const { name, type } = updatedPokemonData;
  try {
    const db = await connectDB();

    const updatedPokemon = db?.run(
      "UPDATE pokemons SET name=?, type=? WHERE id=?",
      name,
      type,
      id
    );

    await db?.close();
    return { success: true, status: 200, data: updatedPokemon };
  } catch (error) {
    return { success: false, status: 500, error: error };
  }
};

export const deletePokemon = async (id: string) => {
  try {
    const db = await connectDB();

    const deletedPokemon = await db?.run(`DELETE FROM pokemons
    WHERE id = ${id}`);


    await db?.close();
    return deletedPokemon?.changes === 0
      ? {
          success: false,
          status: 400,
          error: `Pokemon con ID ${id} no existe`,
        }
      : { success: true, status: 200, data: deletedPokemon };
  } catch (error: any) {
    return { success: false, status: 500, error: error };
  }
};

//TODO, CHECK IF IT WORKS CORRECTLY, NOT TESTED PROPERLY
export const deleteManyPokemons = async (idArray: string[]) => {
  try {
    const db = await connectDB();
    const deletedPokemonsArray: (ISqlite.RunResult<Statement> | undefined)[] =
      [];

    for (const pokemonId of idArray) {
      const deletedPokemon = await db?.run(`DELETE FROM pokemons
          WHERE id = ${pokemonId}`);
      deletedPokemonsArray.push(deletedPokemon);
    }

    await db?.close();

    if (
      lengthIsEqual(deletedPokemonsArray, idArray) &&
      validateChanges(deletedPokemonsArray)
    ) {
      return { success: true, status: 200, data: deletedPokemonsArray };
    }
    return {
      success: false,
      status: 400,
      error: `Algo ha ido mal, uno o más Pokemon no han podido ser eliminados`,
    };
  } catch (error: any) {
    return { success: false, status: 500, error: error };
  }
};
