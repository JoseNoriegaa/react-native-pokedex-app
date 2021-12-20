import React from 'react';
import styled from 'styled-components/native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import FastImage, { Source } from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from './Header';
import { NAME_HEIGHT } from './Name';

export const IMAGE_HEIGHT = 200;

interface ImageProps {
  source: Source;
  scrollY: Animated.SharedValue<number>;
}

const Image: React.FC<ImageProps> = ({
  source,
  scrollY,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.max(
          insets.top + HEADER_HEIGHT,
          insets.top + NAME_HEIGHT + HEADER_HEIGHT + (scrollY.value * -1),
        ),
      },
    ],
    opacity: interpolate(
      scrollY.value,
      [NAME_HEIGHT, insets.top + NAME_HEIGHT + HEADER_HEIGHT],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Container
      style={containerStyles}
    >
      <InnerContainer>
        <FastImage
          source={source}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </InnerContainer>
    </Container>
  );
};

const Container = styled(Animated.View)`
  height: ${IMAGE_HEIGHT}px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const InnerContainer = styled(Animated.View)`
  height: 100%;
  width: 100%;
  margin-bottom: -50px;
`;

export default Image;
