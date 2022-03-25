import { Request, Response, NextFunction } from "express";
import { Pokemon } from "../interfaces/pokemonInterface";
import { getPokemonBy, getPokemonById } from "../persistance/pokemon";

export const pokemonExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pokemonData: Pokemon = req.body;
  const id: string | undefined = req.params.id;

  const existingPokemon = await checkPokemonExists(pokemonData, id);

  if (id) {
    const duplicatedName = await checkPokemonExists(pokemonData, "")
    existingPokemon && !duplicatedName ? next() : res.sendStatus(400); //updating
  } else {
    existingPokemon ? res.sendStatus(400) : next(); //creating
  }
};
const checkPokemonExists = async (pokemonData: Pokemon, id: string) => {
  const { name } = pokemonData;

  try {
    const pokemon = id
      ? await getPokemonById(id)
      : await getPokemonBy("name", name);

    return pokemon.success;
  } catch (error: any) {
    console.log(error.message);
  }
};
