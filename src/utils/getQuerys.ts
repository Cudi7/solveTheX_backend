export const getCurrentQuery = (type: string) => {
  let queryString: string = "";

  switch (type) {
    case "id":
      queryString = `SELECT * FROM pokemons WHERE id = ?`;
      break;
    case "type":
      queryString = `SELECT * FROM pokemons WHERE type = ?`;
      break;
    case "name":
      queryString = `SELECT * FROM pokemons WHERE name = ?`;
      break;
    default:
      break;
  }

  return queryString;
};
