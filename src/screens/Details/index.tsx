import React, { useState } from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../types/navigation';
import Header, { HEADER_HEIGHT } from './components/Header';
import Name, { NAME_HEIGHT } from './components/Name';
import Image, { IMAGE_HEIGHT } from './components/Image';
import About from './components/About';
import BaseStats from './components/BaseStats';
import BackgroundColor from './components/BackgroundColor';
import { WINDOW_HEIGHT } from '../../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'details'>;

const DetailsScreen: React.FC<Props> = ({
  route: {
    params: {
      pokemon,
    },
  },
}) => {
  const insets = useSafeAreaInsets();

  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  const translateY = useSharedValue<number>(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateY.value = event.contentOffset.y;
  });

  const tabDecorationLineStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          tabWidths
            .reduce((acc, width, index) => (index < activeTab ? (acc + (width ?? 0)) : acc), 0),
        ),
      },
    ],
    width: withTiming(tabWidths[activeTab] ?? 0),
  }), [tabWidths, activeTab]);

  const scrollContentStyles = useAnimatedStyle(() => ({
    borderTopLeftRadius: interpolate(
      translateY.value,
      [0, IMAGE_HEIGHT + NAME_HEIGHT],
      [20, 0],
    ),
    borderTopRightRadius: interpolate(
      translateY.value,
      [0, IMAGE_HEIGHT + NAME_HEIGHT],
      [20, 0],
    ),
    minHeight: WINDOW_HEIGHT - insets.top - HEADER_HEIGHT,
  }), []);

  const onPressTab = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Container>

      <BackgroundColor
        pokemon={pokemon}
        contentOffset={
          insets.top
          + HEADER_HEIGHT
          + NAME_HEIGHT
          + IMAGE_HEIGHT
        }
        scrollY={translateY}
      />

      <Image
        source={{
          uri: pokemon.sprites.front_default,
        }}
        scrollY={translateY}
      />

      <Name
        id={pokemon.id}
        name={pokemon.name}
        types={pokemon.types}
        genus={pokemon.genus}
        scrollY={translateY}
        contentOffset={
          insets.top
            + HEADER_HEIGHT
            + NAME_HEIGHT
            + IMAGE_HEIGHT
        }
      />

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        contentContainerStyle={{
          paddingTop: insets.top
            + HEADER_HEIGHT
            + NAME_HEIGHT
            + IMAGE_HEIGHT,
          flexGrow: 1,
        }}
      >

        <ScrollContent
          style={scrollContentStyles}
        >
          <TabsOuterContainer>

            <TabsContainer
              horizontal
              contentContainerStyle={{
                flexGrow: 1,
                height: 40,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => onPressTab(0)}
              >
                <TabButton
                  onLayout={(event) => {
                    if (!tabWidths[0]) {
                      const copy = [...tabWidths];
                      copy[0] = event.nativeEvent.layout.width;
                      setTabWidths(copy);
                    }
                  }}
                >
                  <TabText>
                    About
                  </TabText>
                </TabButton>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => onPressTab(1)}
              >
                <TabButton
                  onLayout={(event) => {
                    if (!tabWidths[1]) {
                      const copy = [...tabWidths];
                      copy[1] = event.nativeEvent.layout.width;
                      setTabWidths(copy);
                    }
                  }}
                >
                  <TabText>
                    Base Stats
                  </TabText>
                </TabButton>
              </TouchableWithoutFeedback>

              <TabDecorationLine
                style={tabDecorationLineStyles}
              />
            </TabsContainer>
          </TabsOuterContainer>

          {
            activeTab === 0 && (
              <About
                pokemon={pokemon}
              />
            )
          }

          {
            activeTab === 1 && (
              <BaseStats
                pokemon={pokemon}
              />
            )
          }

        </ScrollContent>

      </AnimatedScrollView>

      <Header
        scrollY={translateY}
        contentOffset={NAME_HEIGHT + IMAGE_HEIGHT}
      />

    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const AnimatedScrollView = styled(Animated.ScrollView)`
`;

const ScrollContent = styled(Animated.View)`
  backgroundColor: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex: 1;
  padding: 15px;
  z-index: 1000;
`;

const TabsOuterContainer = styled.View`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
`;

const TabsContainer = styled.ScrollView`
  height: 40px;
`;

const TabButton = styled.View`
  flex: 1;
  padding: 10px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const TabText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
`;

const TabDecorationLine = styled(Animated.View)`
  position: absolute;
  height: 2px;
  width: 100px;
  left: 0;
  bottom: 0;
  background-color: #000000;
`;

export default DetailsScreen;
