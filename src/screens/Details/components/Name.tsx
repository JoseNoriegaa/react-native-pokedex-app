import React, { useState } from 'react';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HEADER_HEIGHT } from './Header';
import { Type, TypeContainer } from '../../Menu/components/Pokemon';
import { WINDOW_WIDTH } from '../../../utils/constants';

interface NameProps {
  id: string;
  name: string;
  types: { name: string }[];
  genus: string;
  scrollY: Animated.SharedValue<number>,
  contentOffset: number;
}

export const NAME_HEIGHT = 80;

type Measure = {
  width: number;
  height: number;
};

const Name: React.FC<NameProps> = ({
  id,
  name,
  genus,
  scrollY,
  types,
  contentOffset,
}) => {
  const insets = useSafeAreaInsets();

  const [nameLayout, setNameLayout] = useState<Measure>({
    width: 0,
    height: 0,
  });

  const cointainerStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.max(
          HEADER_HEIGHT + insets.top + (scrollY.value * -1),
          insets.top + ((HEADER_HEIGHT - nameLayout.height) / 2),
        ),
      },
    ],
    paddingHorizontal: 20,
    height: NAME_HEIGHT,
  }), [insets, nameLayout]);

  const titleStyles = useAnimatedStyle(() => ({
    maxWidth: WINDOW_WIDTH - 40 - (HEADER_HEIGHT * 2),
    transform: [
      {
        translateX: interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT],
          [0, (WINDOW_WIDTH / 2) - (nameLayout.width / 2) - 20],
          Extrapolation.CLAMP,
        ),
      },
    ],
    color: interpolateColor(
      scrollY.value,
      [
        0,
        contentOffset
          - NAME_HEIGHT
          - HEADER_HEIGHT
          - insets.top,
        contentOffset - HEADER_HEIGHT - insets.top,
      ],
      ['#ffffff', '#ffffff', '#000000'],
    ),
  }), [insets, nameLayout]);

  const opacityStyles = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }), []);

  return (
    <Container
      style={cointainerStyles}
      pointerEvents="none"
    >
      <NameContainer>
        <Title
          style={titleStyles}
          onLayout={(event) => {
            if (nameLayout.height === 0) {
              setNameLayout({
                width: event.nativeEvent.layout.width,
                height: event.nativeEvent.layout.height,
              });
            }
          }}
        >
          { name }
        </Title>

        <Id
          numberOfLines={1}
          style={opacityStyles}
        >
          #
          { id }
        </Id>
      </NameContainer>

      <MetaContainer
        style={opacityStyles}
      >
        <TypesContainer>
          {
            types.map((type, index) => (
              <TypeContainer
                key={index.toString()}
                style={{
                  marginRight: 10,
                }}
              >
                <Type>
                  { type.name }
                </Type>
              </TypeContainer>
            ))
          }
        </TypesContainer>

        <Genus>
          { genus }
        </Genus>
      </MetaContainer>
    </Container>
  );
};

const Container = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  z-index: 999;
`;

const NameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Id = styled(Animated.Text)`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
`;

const Title = styled(Animated.Text)`
  font-size: 30px;
  font-weight: bold;
  color: #ffffff;
  text-transform: capitalize;
`;

const MetaContainer = styled(Animated.View)`
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TypesContainer = styled.View`
  flex-direction: row;
`;

const Genus = styled.Text`
  font-size: 15px;
  color: #ffffff;
`;

export default Name;
