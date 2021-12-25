import React, { useState, useEffect, useMemo } from 'react';
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
import { useDebouncedValue } from '../../utils/hooks';
import { RootStackParamList } from '../../types/navigation';
import Search from './components/Search';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'menu'>;

const MenuScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // State
  const [limit, setLimit] = useState<number>(20);
  const [showQrReader, setShowQrReader] = useState<boolean>(false);
  const [pokemonList, setPokemonList] = useState<PokemonProps[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Hooks
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const search = useDebouncedValue<string>(searchTerm, 300);

  // Data
  const { data, loading, refetch } = useQuery<GetAllPokemonResponse>(getAllPokemonQuery, {
    variables: {
      limit,
    },
  });

  // Effects
  useEffect(() => {
    if (data && Array.isArray(data?.results)) {
      const copy = [
        ...pokemonList,
        ...data.results.slice(pokemonList.length, data.results.length),
      ];

      setPokemonList(copy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Methods
  const goToDetails = (pokemon: PokemonProps) => {
    navigation.push('details', {
      pokemon,
    });
  };

  const onQRRead = (qrData: string) => {
    const regexp = /^[0-9]+$/;

    if (regexp.test(qrData)) {
      const pokemon = pokemonList.find((p) => p.id === Number(qrData));

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

  const stringMatch = (value: string, pattern: string) : boolean => value
    .toLowerCase().indexOf(pattern) !== -1;

  const filteredPokemons = useMemo((): PokemonProps[] => {
    const normalizedValue = search.toLowerCase().trim();

    if (normalizedValue.length) {
      const output: PokemonProps[] = [];

      for (let i = 0; i < pokemonList.length; i += 1) {
        const pokemon = pokemonList[i];

        // Filter:
        //  - by pokemon name
        //  - pokemon type
        //  - pokemon location, region, or game name

        let shouldBeAdded = false;

        if (stringMatch(pokemon.name, normalizedValue)) {
          shouldBeAdded = true;
        } else if (pokemon.types.some((type) => stringMatch(type.name, normalizedValue))) {
          shouldBeAdded = true;
        } else if (pokemon.locations
          ?.some((location) => stringMatch(location.name, normalizedValue)
            || stringMatch(location.region.name, normalizedValue)
            || location.games.some((game) => stringMatch(game.name, normalizedValue)))) {
          shouldBeAdded = true;
        }

        if (shouldBeAdded) {
          output.push(pokemon);
        }
      }

      return output;
    }

    return pokemonList;
  }, [pokemonList, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (filteredPokemons.length === pokemonList.length) {
      setLimit((v) => v + 20);
    }
  };

  return (
    <>
      <Container>
        <Header />

        <Search
          onChangeText={setSearchTerm}
          value={searchTerm}
        />

        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: insets.bottom,
          }}
          data={filteredPokemons}
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
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
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
