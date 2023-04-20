const fetchPokemonsFirstGeneration = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/generation/1');
  return await response.json();
};

const fetchPokemonsDetails = async (pokemons) => {
  return await Promise.all(
    pokemons.map(async (pokemon) => {
      const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      return await response.json();
    })
  );
};

export { fetchPokemonsFirstGeneration, fetchPokemonsDetails };
