import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const HEADER_HEIGHT = 55;

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Container
      style={{
        paddingTop: insets.top,
      }}
    >
      <InnerContainer>
        <Title>
          Pokedex
        </Title>
      </InnerContainer>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  height: auto;
`;

const InnerContainer = styled.View`
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
`;

export default Header;
