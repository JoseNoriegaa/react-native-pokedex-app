import React from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const HEADER_HEIGHT = 55;

interface HeaderProps {
  scrollY: Animated.SharedValue<number>;
  contentOffset: number;
}

const Header: React.FC<HeaderProps> = ({
  scrollY,
  contentOffset,
}) => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const containerStyles = useAnimatedStyle(() => ({
    paddingTop: insets.top,
    backgroundColor: interpolateColor(
      scrollY.value,
      [contentOffset - HEADER_HEIGHT, contentOffset],
      ['transparent', '#ffffff'],
    ),
  }), []);

  const colorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollY.value,
      [contentOffset - HEADER_HEIGHT, contentOffset],
      ['#ffffff', '#000000'],
    ),
  }), []);

  return (
    <Container
      style={containerStyles}
    >
      <InnerContainer>
        <TouchableWithoutFeedback
          onPress={() => navigation.goBack()}
        >
          <IconContainer
            style={{
              zIndex: 9999,
            }}
          >
            <AnimatedIcon
              name="ios-arrow-back-outline"
              size={24}
              style={colorStyle}
            />
          </IconContainer>
        </TouchableWithoutFeedback>
      </InnerContainer>
    </Container>
  );
};

const Container = styled(Animated.View)`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const InnerContainer = styled.View`
  flex-direction: row;
`;

const IconContainer = styled.View`
  aspect-ratio: 1;
  width: ${HEADER_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

export default Header;
