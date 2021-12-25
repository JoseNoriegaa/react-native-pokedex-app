import React, { useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated';
import styled from 'styled-components';
import { Pokemon } from '../../../types/pokemonApi';
import { getColorFromPokemonType } from '../../../utils/pokemon';

interface BackgroundColorProps {
  pokemon: Pokemon;
  contentOffset: number;
  scrollY: Animated.SharedValue<number>;
}

const BackgroundColor: React.FC<BackgroundColorProps> = ({
  pokemon,
  contentOffset,
  scrollY,
}) => {
  const color = useMemo(() => getColorFromPokemonType(pokemon.types[0]?.name || ''), [pokemon]);

  const styles = useAnimatedStyle(() => ({
    backgroundColor: color,
    height: contentOffset + 20 + (scrollY.value * -1),
    zIndex: -1,
  }), [contentOffset, color]);

  return (
    <Container
      style={styles}
    />
  );
};

const Container = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

export default BackgroundColor;
