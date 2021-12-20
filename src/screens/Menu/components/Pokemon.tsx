import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { getColorFromPokemonType } from '../../../utils/pokemon';

interface PokemonProps {
  name: string;
  types: { name: string }[];
  image: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

const Pokemon: React.FC<PokemonProps> = ({
  name,
  types,
  image,
  style,
  onPress,
  disabled,
}) => {
  // Memoized
  const color = useMemo(() => {
    const type = types[0].name;
    return getColorFromPokemonType(type?.toLowerCase() ?? 'normal');
  }, [types]);

  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        style,
        {
          backgroundColor: color,
        },
      ]}
    >
      <Name
        numberOfLines={1}
      >
        { name }
      </Name>

      <InnerContainer>
        <InfoContainer>
          {
            types.filter((_, index) => index < 2).map((type, index) => (
              <TypeContainer
                key={index.toString()}
              >
                <Type>
                  { type.name }
                </Type>
              </TypeContainer>
            ))
          }
        </InfoContainer>

        <ImageContainer>
          <FastImage
            source={{
              uri: image,
            }}
            style={{
              height: '100%',
              width: '100%',
            }}
            resizeMode={FastImage.resizeMode.center}
          />
        </ImageContainer>

      </InnerContainer>
    </Container>
  );
};

Pokemon.defaultProps = {
  style: {},
  onPress: () => {},
  disabled: false,
};

const Container = styled.TouchableOpacity`
  background-color: green;
  aspect-ratio: 1.5;
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  overflow: hidden;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 5;
`;

const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
`;

const InnerContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const TypeContainer = styled.View`
  padding-horizontal: 5px;
  padding-vertical: 2px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  margin-top: 5px;
  width: auto;
`;

export const Type = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
`;

const InfoContainer = styled.View`
  padding-top: 10px;
`;

const ImageContainer = styled.View`
  height: 100px;
  width: 100px;
  position: absolute;
  bottom: -20px;
  right: -20px;
`;

export default Pokemon;
