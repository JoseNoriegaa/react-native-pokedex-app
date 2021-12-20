import { Pokemon } from './pokemonApi';

type RootStackParamList = {
  menu: undefined;
  details: {
    pokemon: Pokemon;
  };
};

export type {
  RootStackParamList,
};
