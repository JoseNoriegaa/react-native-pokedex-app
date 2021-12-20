import React, { useState } from 'react';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Pokemon } from '../../../types/pokemonApi';

interface BaseStatsProps {
  pokemon: Pokemon;
}

const MAX_VALUES = {
  hp: 500,
  attack: 500,
  defense: 500,
  specialAttack: 500,
  specialDefense: 500,
  speed: 500,
  total: 500,
};

MAX_VALUES.total = MAX_VALUES.hp
  + MAX_VALUES.attack
  + MAX_VALUES.defense
  + MAX_VALUES.specialAttack
  + MAX_VALUES.specialDefense
  + MAX_VALUES.speed;

const BaseStats: React.FC<BaseStatsProps> = ({
  pokemon,
}) => {
  const [barWidth, setBarWidth] = useState<number>(0);

  const hpAnimatedValues = useAnimatedStyle(() => ({
    width: withTiming((pokemon.base_stats.hp / MAX_VALUES.hp) * barWidth),
  }), [barWidth]);

  const attackAnimatedValues = useAnimatedStyle(() => ({
    width: withTiming((pokemon.base_stats.attack / MAX_VALUES.attack) * barWidth),
  }), [barWidth]);

  const defenseAnimatedValues = useAnimatedStyle(() => ({
    width: withTiming((pokemon.base_stats.defense / MAX_VALUES.defense) * barWidth),
  }), [barWidth]);

  const sAttackAnimatedValues = useAnimatedStyle(() => ({
    width: withTiming((pokemon.base_stats.special_attack / MAX_VALUES.specialAttack) * barWidth),
  }), [barWidth]);

  const sDefenseAnimatedValues = useAnimatedStyle(() => ({
    width: withTiming((pokemon.base_stats.special_defense / MAX_VALUES.specialDefense) * barWidth),
  }), [barWidth]);

  const speedAnimatedValues = useAnimatedStyle(() => ({
    width: withTiming((pokemon.base_stats.speed / MAX_VALUES.speed) * barWidth),
  }), [barWidth]);

  const totalAnimatedValues = useAnimatedStyle(() => ({
    width: withTiming(
      ((pokemon.base_stats.hp
        + pokemon.base_stats.attack
        + pokemon.base_stats.defense
        + pokemon.base_stats.special_attack
        + pokemon.base_stats.special_defense
        + pokemon.base_stats.speed) / MAX_VALUES.total) * barWidth,
    ),
  }), [barWidth]);

  return (
    <Container>
      <Field>
        <FieldName>
          HP
        </FieldName>

        <Value>
          { pokemon.base_stats.hp }
        </Value>

        <LineContainer>
          <LinePlaceholder
            onLayout={(event) => {
              if (barWidth === 0) {
                setBarWidth(event.nativeEvent.layout.width);
              }
            }}
          />

          <ProgressLine
            style={hpAnimatedValues}
          />
        </LineContainer>
      </Field>

      <Field>
        <FieldName>
          Attack
        </FieldName>

        <Value>
          { pokemon.base_stats.attack }
        </Value>

        <LineContainer>
          <LinePlaceholder />

          <ProgressLine
            style={attackAnimatedValues}
          />
        </LineContainer>
      </Field>

      <Field>
        <FieldName>
          Defense
        </FieldName>

        <Value>
          { pokemon.base_stats.defense }
        </Value>

        <LineContainer>
          <LinePlaceholder />

          <ProgressLine
            style={defenseAnimatedValues}
          />
        </LineContainer>
      </Field>

      <Field>
        <FieldName>
          Sp. Atk
        </FieldName>

        <Value>
          { pokemon.base_stats.special_attack }
        </Value>

        <LineContainer>
          <LinePlaceholder />

          <ProgressLine
            style={sAttackAnimatedValues}
          />
        </LineContainer>
      </Field>

      <Field>
        <FieldName>
          Sp. Def
        </FieldName>

        <Value>
          { pokemon.base_stats.special_defense }
        </Value>

        <LineContainer>
          <LinePlaceholder />

          <ProgressLine
            style={sDefenseAnimatedValues}
          />
        </LineContainer>
      </Field>

      <Field>
        <FieldName>
          Speed
        </FieldName>

        <Value>
          { pokemon.base_stats.speed }
        </Value>

        <LineContainer>
          <LinePlaceholder />

          <ProgressLine
            style={speedAnimatedValues}
          />
        </LineContainer>
      </Field>

      <Field>
        <FieldName>
          Total
        </FieldName>

        <Value>
          {
            pokemon.base_stats.hp
            + pokemon.base_stats.attack
            + pokemon.base_stats.defense
            + pokemon.base_stats.special_attack
            + pokemon.base_stats.special_defense
            + pokemon.base_stats.speed
          }
        </Value>

        <LineContainer>
          <LinePlaceholder />

          <ProgressLine
            style={totalAnimatedValues}
          />
        </LineContainer>
      </Field>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Field = styled.View`
  flex-direction: row;
  margin-vertical: 10px;
`;

const FieldName = styled.Text`
  width: 100px;
  color: #BDBEC3;
  font-size: 16px;
  font-weight: bold;
`;

const Value = styled.Text`
  font-size: 16px;
  color: #000000;
  width: 50px;
`;

const LineContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const LinePlaceholder = styled.View`
  height: 5px;
  background-color: #F9F9F9;
  width: 100%;
`;

const ProgressLine = styled(Animated.View)`
  height: 5px;
  background-color: #62CFA0;
  width: 100%;
  position: absolute;
  left: 0;
`;

export default BaseStats;
