interface Pokemon {
  id: number;
  sprites: {
    front_default: string;
  };
  name: string;
  color: string;
  genus: string;
  height: number;
  weight: number;
  gender_rate: number;
  generation: string;
  base_stats: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  types: {
    name: string;
  }[];
  abilities: {
    name: string;
  }[];
  egg_groups: {
    name: string;
  }[];
  locations: null | {
    name: string;
    region: {
      name: string;
    };
    games: {
      name: string;
    }[];
  }[];
}

interface GetAllPokemonResponse {
  results: Pokemon[];
}

export type {
  Pokemon,
  GetAllPokemonResponse,
};
