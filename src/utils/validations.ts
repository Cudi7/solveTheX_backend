import { ISqlite } from "sqlite";
import { Statement } from "sqlite3";

export const lengthIsEqual = (
  deletedPokemonsArray: (ISqlite.RunResult<Statement> | undefined)[],
  idArray: string[]
) => {
  return deletedPokemonsArray.length === idArray.length;
};

export const validateChanges = (
  deletedPokemonsArray: (ISqlite.RunResult<Statement> | undefined)[]
) => {
  console.log(deletedPokemonsArray.length);
  console.log(deletedPokemonsArray);
  return deletedPokemonsArray.every(
    (deletedPokemon) => deletedPokemon?.changes === 1
  );
};
