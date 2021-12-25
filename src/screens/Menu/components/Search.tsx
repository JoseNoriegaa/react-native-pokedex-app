import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchProps {
  onChangeText: (text: string) => void;
  value: string;
}

const Search: React.FC<SearchProps> = ({
  onChangeText,
  value,
}) => (
  <Container>
    <Icon name="ios-search" size={24} color="#999" />
    <Input
      onChangeText={onChangeText}
      value={value}
      placeholder="Search"
      blurOnSubmit
    />
  </Container>
);

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 18px;
  color: #333;
  margin-left: 10px;
`;

export default Search;
