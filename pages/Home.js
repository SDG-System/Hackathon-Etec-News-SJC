import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const Home = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Principal'); // Navega para a tela SampleHttps
    }, 8000); // Duração em milissegundos

    return () => clearTimeout(timer); // Limpar o timer ao desmontar
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5fcf80' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Image
            source={require('../assets/cps-transparente.png')}
            style={{ width: 125, height: 125, resizeMode: 'contain' }}
          />

          <Image
            source={require('../assets/logo-etec-transparente.png')}
            style={{ width: 125, height: 125, resizeMode: 'contain' }}
          />  
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/ETEC-SJC.png')}
            style={styles.image}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="white" />
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.title}>Professor/Orientador</Text>
          <Text style={styles.text}>Claudio Ferrini </Text>
          <Text style={styles.text}>Rogério B. Andrade </Text>
          <Text style={styles.title1}>Equipe de Desenvolvimento</Text>
          <Text style={styles.text}>Davi Lucas da Cunha </Text>
          <Text style={styles.text}> Ítalo Cardoso da Silva</Text>
          <Text style={styles.text}> Rodrigo de Andrade Paula</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },

  title1: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
     marginTop: 20
  },

  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Home;
