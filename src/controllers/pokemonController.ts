import app, { Request, Response } from "express";
import { Pokemon } from "../interfaces/pokemonInterface";
import { pokemonExists } from "../middleware/pokemonExists";
import {
  addPokemon,
  deleteManyPokemons,
  deletePokemon,
  getAllPokemons,
  getPokemonBy,
  getPokemonById,
  updatePokemon,
} from "../persistance/pokemon";

const route = app.Router();

//@getAllPokemons
route.get("/all", async (req: Request, res: Response) => {
  const pokemons = await getAllPokemons();
  const { status, success, data, error } = pokemons;

  return success
    ? res.status(status).json({ success, data })
    : res.status(status).json({ success, error });
});

//@getPokemonById
route.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const pokemon = await getPokemonById(id);

  const { status, success, data, error } = pokemon;

  return success
    ? res.status(status).json({ success, data })
    : res.status(status).json({ success, error });
});

//@getPokemonBy?
route.get("/custom/:type&:customData", async (req: Request, res: Response) => {
  const { type, customData } = req.params;

  const pokemon = await getPokemonBy(type, customData);

  const { status, success, data, error } = pokemon;

  return success
    ? res.status(status).json({ success, data })
    : res.status(status).json({ success, error });
});

//@postNewPokemon
route.post("/new", pokemonExists, async (req: Request, res: Response) => {
  const pokemonData: Pokemon = req.body;
  const pokemon = await addPokemon(pokemonData);

  const { status, success, error } = pokemon;

  return success
    ? res.status(status).json({ success })
    : res.status(status).json({ success, error });
});

//@updatePokemon
route.patch(
  "/update/:id",
  pokemonExists,
  async (req: Request, res: Response) => {
    const pokemonData: Pokemon = req.body;
    const id: string = req.params.id;
    const pokemon = await updatePokemon(pokemonData, id);

    const { status, success, error } = pokemon;

    return success
      ? res.status(status).json({ success })
      : res.status(status).json({ success, error });
  }
);

//@deleteSinglePokemon
route.delete("/delete/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const deletedPokemon = await deletePokemon(id);
  const { status, success, error } = deletedPokemon;

  return success
    ? res.status(status).json({ success })
    : res.status(status).json({ success, error });
});

//@deleteManyPokemons
route.delete("/delete", async (req: Request, res: Response) => {
  const idArray: string[] = req.body.id;
  const deletedPokemons = await deleteManyPokemons(idArray);

  const { status, success, error } = deletedPokemons;

  return success
    ? res.status(status).json({ success })
    : res.status(status).json({ success, error });
});

export default route;
