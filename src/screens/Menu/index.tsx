import React, { useState } from 'react';
import {
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@apollo/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';
import Modal from 'react-native-modal';
import BarcodeMask from 'react-native-barcode-mask';

import Header from './components/Header';
import Pokemon from './components/Pokemon';
import { getAllPokemonQuery } from '../../services/pokemonApi';
import { GetAllPokemonResponse, Pokemon as PokemonProps } from '../../types/pokemonApi';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/constants';
import { RootStackParamList } from '../../types/navigation';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'menu'>;

const MenuScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // State
  const [limit, setLimit] = useState<number>(20);
  const [showQrReader, setShowQrReader] = useState<boolean>(false);

  // Hooks
  const navigation = useNavigation<MenuScreenNavigationProp>();

  // Data
  const { data, loading } = useQuery<GetAllPokemonResponse>(getAllPokemonQuery, {
    variables: {
      limit,
    },
  });
  const pokemons = data?.results ?? [];

  // Methods
  const goToDetails = (pokemon: PokemonProps) => {
    navigation.push('details', {
      pokemon,
    });
  };

  const onQRRead = (qrData: string) => {
    const regexp = /^[0-9]+$/;

    if (regexp.test(qrData)) {
      const pokemon = pokemons.find((p) => p.id === Number(qrData));

      if (pokemon) {
        setShowQrReader(false);
        navigation.reset({
          index: 1,
          routes: [
            { name: 'menu' },
            { name: 'details', params: { pokemon } },
          ],
        });
      }
    }
  };

  return (
    <>
      <Container>
        <Header />

        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: insets.bottom,
          }}
          data={pokemons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: pokemon, index }) => (
            <Pokemon
              onPress={() => goToDetails(pokemon)}
              disabled={loading}
              name={pokemon.name}
              types={pokemon.types}
              image={pokemon.sprites.front_default}
              style={{
                width: (WINDOW_WIDTH / 2) - 15,
                marginLeft: index % 2 === 0 ? 0 : 10,
                marginTop: 10,
              }}
            />
          )}
          numColumns={2}
          onEndReached={() => setLimit((v) => v + 20)}
          onEndReachedThreshold={0.5}
        />

        <CameraButton
          style={{
            bottom: insets.bottom + 10,
          }}
          onPress={() => setShowQrReader(true)}
        >
          <Icon
            name="ios-qr-code-outline"
            size={30}
            color="#fff"
          />
        </CameraButton>

      </Container>

      <Modal
        isVisible={showQrReader}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: 'red',
        }}
      >
        <CameraContainer>
          <RNCamera
            style={{
              height: WINDOW_HEIGHT,
              width: WINDOW_WIDTH,
            }}
            onBarCodeRead={(event) => {
              onQRRead(event.data);
            }}
          >
            <BarcodeMask
              edgeColor="#62B1F6"
              showAnimatedLine={false}
            />

            <CancelButton
              onPress={() => setShowQrReader(false)}
            >
              <Icon
                name="ios-close-circle-outline"
                size={30}
                color="#fff"
              />
            </CancelButton>
          </RNCamera>

        </CameraContainer>
      </Modal>
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const CameraButton = styled.TouchableOpacity`
  background-color: #0297F4;
  position: absolute;
  right: 15px;
  z-index: 100;
  width: 55px;
  height: 55px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const CameraContainer = styled.View`
  flex: 1;
  height: ${WINDOW_WIDTH}px;
  width: ${WINDOW_HEIGHT}px;
  background-color: #ffffff;
`;

const CancelButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  width: 55px;
  height: 55px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export default MenuScreen;
