import * as fs from 'fs';

const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=151";

async function getPokeList()
{
    const pokemonList = await fetch(apiUrl).then(response => response.json().then(responseJson => responseJson.results));
    return pokemonList;
};

async function getPokemonData(pokemonUrl)
{
    let pokeData;

    await fetch(pokemonUrl)
        .then(response => response.json())
        .then(responseJson => 
            {
                pokeData = 
                {
                    nome: responseJson.name,
                    altura: responseJson.height,
                    peso: responseJson.weight,
                    tipos: responseJson.types.map(type => type.type.name),
                    numero: responseJson.id
                };
            });
    return pokeData;
};

async function generatePokemonsFile()
{
    const pokemonGeneralList = await getPokeList();
    const pokeFinalData = await Promise.all(
        pokemonGeneralList.map(async (pokemon) => {
          const pokeData = await getPokemonData(pokemon.url);
          return pokeData;
        })
      );

    const content = JSON.stringify(pokeFinalData, null, 2);

    fs.writeFileSync('pokemon.json', content);
    console.log('Arquivo "pokemon.json" gerado com sucesso.');
}

generatePokemonsFile();