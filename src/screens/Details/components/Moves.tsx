import React from 'react';
import styled from 'styled-components/native';

const Moves: React.FC = () => {
  '';

  return (
    <Container>
      <Title>
        Moves
      </Title>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

export default Moves;
