import React, { Component, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const SampleHttp = () => {
  //state para armazenar a lista de produtos
  const [listaProdutos, setListaProdutos] = useState([]);
  // variável para indicar que está buscando as informações
  const [loading, setLoading] = useState(false);
  // timeout
  const [timeOut, setTimeOut] = useState(10000);
  const clickItemFlatList = (item) => {
    alert(item.cdvaga + '-' + item.nm_vaga);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = listaProdutos.filter((item) =>
   item.nm_vaga.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // executa a busca logo no início da execução
  useEffect(() => {
    const filtro = getInformacoesBD();
  }, []);

  async function getInformacoesBD() {
    setLoading(true);

    // endereço remoto do localhost (via ngrok)
    var url = global.urlEndPoint;
    // faz um fetch (requisição htpp ao script que está encarregado de
    // realizar a consulta de inf. no banco de dados)
    //... creating config obj here (not relevant for this answer)
    var wasServerTimeout = false;
    var timeout = setTimeout(() => {
      wasServerTimeout = true;
      setLoading(false);
      alert('Tempo de espera para busca informações excedido');
    }, timeOut);

    const resposta = await fetch(url, {
      method: 'GET', //tipo de requisição
    })
      // quando o script php terminar de executar vai executar a próxima linha
      .then((response) => {
        timeout && clearTimeout(timeout); //If everything is ok, clear the timeout
        if (!wasServerTimeout) {
          return response.json();
        }
      }) // os dados já vieram? Converte em JSON
      .then((responseJson) => {
        // os dados já foram convertidoks
        // mostra o que obteve do banco a partir do script
        //alert(JSON.stringify(responseJson));
        setListaProdutos([]);

        for (var i = 0; i < responseJson.length; i++) {
          setListaProdutos((listaProdutos) => {
            const list = [
              ...listaProdutos,
              {
                cdvaga: responseJson[i].cdvaga,
                id_tipo_vaga: responseJson[i].id_tipo_vaga,
                nm_vaga: responseJson[i].nm_vaga,
                ds_vaga: responseJson[i].ds_vaga,
                ds_keyword: responseJson[i].ds_keywords,
                st_vaga: responseJson[i].st_vaga,
                dt_registro_vaga: responseJson[i].dt_registro_vaga,
                url_imagem_vaga: responseJson[i].url_imagem_vaga,
                nm_tipo_vaga: responseJson[i].nm_tipo_vaga
              },
            ];
            return list;
          });
        }
      })
      //se ocorrer erro na requisição ou conversãok
      .catch((error) => {
        timeout && clearTimeout(timeout);
        if (!wasServerTimeout) {
          alert('error no servidor' + error);
        }

        console.log('erro' + error);
      });

    setLoading(false);
  }

  return (
    <View style={{ padding: 16 }}>
      {loading ? (
        <View>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              marginBottom: 16,
              fontFamily: 'century gothic',
            }}>
            Aguarde obtendo informações
          </Text>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : null}
      <Text
        style={{
          fontSize: 25,
          textAlign: 'center',
          marginBottom: 16,
          fontFamily: 'century gothic',
        }}></Text>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar ..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View>
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => clickItemFlatList(item)}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderRadius: 5,
                  backgroundColor: item.id % 2 == 0 ? '@DCDCDC' : '#C0C0C0',
                }}>
                <Text style={styles.fontTexto}>Cd Vaga: {item.cdvaga}</Text>
                <Text style={styles.fontTexto}>ID Vaga: {item.id_tipo_vaga} </Text>
                <Text style={styles.fontTexto}>Nome: {item.nm_vaga} </Text>
                <Text style={styles.fontTexto}>Descrição: {item.ds_vaga} </Text>
                <Text style={styles.fontTexto}>Palavra-chave: {item.ds_keywords} </Text>
                <Text style={styles.fontTexto}>Status: {item.st_vaga} </Text>   
                <Text style={styles.fontTexto}>Registro: {item.dt_registro_vaga} </Text> 
                <Text style={styles.fontTexto}>Url Imagem: {item.url_imagem_vaga} </Text> 
                <Text style={styles.fontTexto}>Tipo de Vaga: {item.nm_tipo_vaga} </Text> 
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View></View>
    </View>
  );
};

export default SampleHttp;
const styles = StyleSheet.create({
  button: {
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#C0C0C0',
    padding: 10,
    width: '100%',
    marginTop: 16,
  },
  input: {
    border: 10,
  },

  fontTexto: {
    margin: 4,
    fontWeight: 'italic',
    fontSize: 10,
    fontFamily: 'century gothic',
    color: 'black',
  },
});
