import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Picker } from '@react-native-picker/picker'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

const SampleHttp = () => {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeOut, setTimeOut] = useState(10000);
  const [carregarVagas, setCarregarVagas] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('nm_vaga');
  const [visibleItems, setVisibleItems] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favoritos, setFavoritos] = useState(new Set()); 

  const clickItemFlatList = (item) => {
    alert(item.cdvaga + '-' + item.nm_vaga);
  };

  const loadFavoritos = async () => {
    try {
      const favoritosSalvos = await AsyncStorage.getItem('favoritos');
      if (favoritosSalvos) {
        setFavoritos(new Set(JSON.parse(favoritosSalvos)));
      }
    } catch (error) {
      console.log('Erro ao carregar favoritos: ', error);
    }
  };

  // Função para salvar os favoritos no AsyncStorage
  const saveFavoritos = async (favoritosAtualizados) => {
    try {
      await AsyncStorage.setItem('favoritos', JSON.stringify(Array.from(favoritosAtualizados)));
    } catch (error) {
      console.log('Erro ao salvar favoritos: ', error);
    }
  };

  useEffect(() => {
    loadFavoritos();
  }, []);

  useEffect(() => {
    if (carregarVagas) {
      getInformacoesBD();
    }
  }, []);

  async function getInformacoesBD() {
    setLoading(true);
    var url = global.urlEndPoint;
    var wasServerTimeout = false;
    var timeout = setTimeout(() => {
      wasServerTimeout = true;
      setLoading(false);
      alert('Tempo de espera para busca informações excedido');
  }, timeOut);

  const resposta = await fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        timeout && clearTimeout(timeout);
        if (!wasServerTimeout) {
          return response.json();
        }
      })
      .then((responseJson) => {
        setListaProdutos(responseJson);
      })
      .catch((error) => {
        timeout && clearTimeout(timeout);
        if (!wasServerTimeout) {
          alert('Erro no servidor: ' + error);
        }
        console.log('Erro: ' + error);
      });

    setLoading(false);
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
  }).start();

  const toggleModal = (item) => {
    setSelectedItem(item);
    setModalVisible(!modalVisible);
  };

  const filterByField = (item) => {
    if (selectedSearchField === 'favoritos') {
      return favoritos.has(item.cdvaga); 
    }
    
    if (selectedSearchField && searchQuery) {
      const fieldValue = item[selectedSearchField]?.toString().toLowerCase();
      return fieldValue.includes(searchQuery.toLowerCase());
    }
    return true; 
  };

  const toggleFavorite = (item) => {
    const updatedFavoritos = new Set(favoritos);
    if (updatedFavoritos.has(item.cdvaga)) {
      updatedFavoritos.delete(item.cdvaga);
    } else {
      updatedFavoritos.add(item.cdvaga);
    }
    setFavoritos(updatedFavoritos);
    saveFavoritos(updatedFavoritos); 
  };

  const formatarDataBrasileira = (data) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); 
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const renderItem = ({ item }) => {
    if (item.id_tipo_vaga == 2 && filterByField(item)) {
      const isFavorite = favoritos.has(item.cdvaga);
      return (
        <TouchableOpacity onPress={() => clickItemFlatList(item)}>
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => toggleFavorite(item)} 
                                style={styles.favoriteButton}>
                  <Text style={styles.favoriteText}>{isFavorite ? '★' : '☆'}</Text>
                </TouchableOpacity>
                <Animated.View
                  style={[
                    styles.fadingContainer,
                    {
                      opacity: fadeAnim,
                    },
                  ]}>
                
                  <Image
                    source={{ uri: 'https://etecsjcampos.com.br/vagas/2.png' }}
                    style={{ width: 200, height: 200, resizeMode: 'contain' }}
                  />
              </Animated.View>  
            </View>
            <View style={styles.itemTextContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.nm_vaga}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleModal(item)} style={styles.saibaMaisButton}>
                <Text style={styles.saibaMaisText}>Saiba Mais</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null; 
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      {loading ? (
        <View>
          <Text style={styles.loadingText}>Aguarde obtendo informações</Text>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : null}

      <StatusBar barStyle="dark-content" />

      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={24} color="#5fcf80" style={styles.searchIcon} />
        <TextInput
          placeholder="Pesquise a Vaga"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close" size={24} color="#5fcf80" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.searchFieldContainer}>
        <Text style={styles.filterLabel}>Selecionar campo de busca da Vaga:</Text>
        <Picker
          selectedValue={selectedSearchField}
          onValueChange={(itemValue) => setSelectedSearchField(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Nome Vaga" value="nm_vaga" />
          <Picker.Item label="Descrição" value="ds_vaga" />
          <Picker.Item label="Palavra-Chave" value="ds_keywords" />
          <Picker.Item label="Favoritos" value="favoritos" />
        </Picker>
      </View>

      <FlatList
        data={listaProdutos}
        renderItem={renderItem}
        keyExtractor={(item) => item.cdvaga.toString()}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <ScrollView style={styles.itemModal} showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: 'https://etecsjcampos.com.br/vagas/2.png' }}
                  style={{ width: '100%', height: 200, resizeMode: 'contain' }}
                />
                <Text style={styles.itemTitle1}>{selectedItem.nm_vaga}</Text>
                <Text style={styles.itemDetails}>
                  Cd Vaga: <Text style={styles.fontTexto}>{selectedItem.cdvaga}</Text>
                </Text>
                <Text style={styles.itemDetails}>
                  ID Vaga: <Text style={styles.fontTexto}>{selectedItem.id_tipo_vaga}</Text>
                </Text>
                <Text style={styles.fontTexto}>{selectedItem.ds_vaga}</Text>
                <Text style={styles.itemDetails}>
                  Palavra-chave: <Text style={styles.fontTexto}>{selectedItem.ds_keywords}</Text>
                </Text>
                <Text style={styles.itemDetails}>
                  Postado em: <Text style={styles.fontTexto}>{formatarDataBrasileira(selectedItem.dt_registro_vaga)}</Text>
                </Text>

                <Text style={styles.itemDetails}>
                  Tipo de Vaga: <Text style={styles.fontTexto}>{selectedItem.nm_tipo_vaga}</Text>
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View> 
  );
};

export default SampleHttp;

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'century gothic',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    backgroundColor: '#c6e5b1',
    padding: 10,
    marginBottom: 10,
  },
  fontTexto: {
    margin: 4,
    fontWeight: 'italic',
    fontSize: 14,
    fontFamily: 'century gothic',
    color: 'black',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  itemTitle: {
    margin: 5,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white',
  },
  itemTitle1: {
    margin: 5,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemDetails: {
    margin: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saibaMaisButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#5fcf80',
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  saibaMaisText: {
    color: 'white',
    fontWeight: 'bold',
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

  searchFieldContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#c6e5b1',
    borderRadius: 10,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10, 
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#c6e5b1',
    borderRadius: 10,
    padding: 10,
    marginTop: 100,
  },
  itemModal: {
    height: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 5,
    marginBottom: 20,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#5fcf80',
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center', 
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },

  favoriteButton: {
    alignSelf: 'flex-end', 
  },
  favoriteText: {
    fontSize: 40,
    color: '#FFD700', 
  },
});
