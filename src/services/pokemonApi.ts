import { gql } from '@apollo/client';

const getAllPokemonQuery = gql`
  query Pokemons ($limit: Int!) {
    results: allPokemon (limit: $limit) {
      id
      name
      color
      genus
      height
      weight
      gender_rate
      base_stats {
        hp
        attack
        defense
        special_attack
        special_defense
        speed
      }
      sprites {
        front_default
      }
      types {
        name
      }
      abilities {
        name
      }
      egg_groups {
        name
      }
    }
  }
`;

export {
  getAllPokemonQuery,
};
