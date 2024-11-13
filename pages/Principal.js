import React, { useState, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const data = [
  {
    id: 1,
    url: 'https://etecsjcampos.com.br/vagas/1.png',
    nome: 'Vagas de Emprego',
    descricao: 'Confira as vagas de emprego da Etec Jobs',
    palavrachave:'Emprego',
    route: 'Emprego',                                        
  },
  {
    id: 2,
    url: 'https://etecsjcampos.com.br/vagas/2.png',
    nome: 'Vagas de Estágio',
    descricao: 'Confira as vagas de estágio da Etec Jobs',
    palavrachave:'Estagio',
    route: 'Estagio',
  },
  {
    id: 3,
    url: 'https://etecsjcampos.com.br/vagas/3.png',
    nome: 'Vagas de Aprendiz',
    descricao: 'Confira as vagas de aprendiz da Etec Jobs',
    palavrachave:'Aprendiz',
    route: 'Aprendiz',
  },
];

const Pagina2 = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtra a lista com base no valor da busca
  const filteredNome = data.filter((item) =>
    item.palavrachave.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 4000,
  }).start();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      underlayColor="white"
      onPress={() => navigation.navigate(item.route, { id: item.id })}>
      <View style={{
          padding: 10,
          margin: 10,
          marginBottom: 5,
          borderWidth: 1,
          borderRadius: 10,
          alignSelf: 'center',
          backgroundColor: 'white',
          width:'95%',
        }}>

         <Text
          style={{
            margin: 5,
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {item.nome}
        </Text>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{ uri: item.url }}
              style={{ width: 200, height: 200, borderRadius: 5, alignItems: 'center', }}
            />
          </View>

        </View>
    </TouchableOpacity>
  );

  const clearSearch = () => {
    setSearchQuery('');
  };


  return (
    <View style={styles.container}>

      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          placeholder="Pesquisa de Vagas"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text
        style={{
          margin: 10,
          fontSize: 25,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        Confira as vagas disponíveis na Etec Jobs
      </Text>

      <FlatList
        data={filteredNome}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
  },
});

export default Pagina2;
