import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Pokemon } from '../../../types/pokemonApi';

interface AboutProps {
  pokemon: Pokemon;
}

const About: React.FC<AboutProps> = ({
  pokemon,
}) => {
  '';

  return (
    <Container>
      <Field>
        <FieldName>
          Species
        </FieldName>

        <Value>
          { pokemon.genus }
        </Value>
      </Field>

      <Field>
        <FieldName>
          Height
        </FieldName>

        <Value>
          { pokemon.height / 100 }
          { ' ' }
          meters.
        </Value>
      </Field>

      <Field>
        <FieldName>
          Weight
        </FieldName>

        <Value>
          { pokemon.weight / 100 }
          { ' ' }
          kilograms.
        </Value>
      </Field>

      <Field>
        <FieldName>
          Abilities
        </FieldName>

        <Value>
          {
            pokemon.abilities.map((x) => x.name).join(', ')
          }
        </Value>
      </Field>

      <Title>
        Breeding
      </Title>

      <Field>
        <FieldName>
          Gender
        </FieldName>

        <GroupValue>
          <GroupValue>
            <Icon
              name="ios-male-outline"
              size={22}
              color="#B8BADE"
            />
            <Value
              style={{
                marginLeft: 5,
              }}
            >
              {
                100 - pokemon.gender_rate
              }
              %
            </Value>
          </GroupValue>

          <GroupValue>
            <Icon
              name="ios-female-outline"
              size={22}
              color="#F6B8D0"
            />
            <Value
              style={{
                marginLeft: 5,
              }}
            >
              {
                pokemon.gender_rate
              }
              %
            </Value>
          </GroupValue>
        </GroupValue>

      </Field>

      <Field>
        <FieldName>
          Egg Groups
        </FieldName>

        <Value>
          {
            pokemon.egg_groups.map((x) => x.name).join(', ')
          }
        </Value>
      </Field>

    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Field = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 10px;
`;

const FieldName = styled.Text`
  font-size: 16px;
  color: #959598;
  font-weight: bold;
  width: 30%;
`;

const GroupValue = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const Value = styled.Text`
  font-size: 16px;
  color: #000000;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-vertical: 10px;
`;

export default About;
