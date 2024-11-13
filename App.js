import 'react-native-gesture-handler';
import {
  Image,
  View, 
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './pages/Home';
import Principal from './pages/Principal';
import Emprego from './pages/Emprego';
import Estagio from './pages/Estagio';
import Aprendiz from './pages/Aprendiz';
import Vagas from './pages/Vagas'; 
import SampleHttp from './components/SampleHttp'; 

global.urlEndPoint = 'https://etecsjcampos.com.br/api/api.php?inicio=1&';

// Cria os objetos de controle de navegação
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5fcf80',
          height: 120, 
        },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{
                width: 120,
                height: 120,
                marginTop: 5,
                resizeMode: 'contain',
              }}
              source={require('./assets/ETEC-SJC.png')}
            />
          </View>
        ),
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home Page', headerShown: false }}
      />
      <Stack.Screen
        name="SampleHttps"
        component={SampleHttp}
        options={{ title: 'Home Page', headerShown: false }}
      />
      <Stack.Screen
        name="Principal"
        component={Principal}
        options={{ title: 'Vagas' }}
      />
      <Stack.Screen
        name="Emprego"
        component={Emprego}
        options={{ title: 'Emprego' }}
      />
      <Stack.Screen
        name="Estagio"
        component={Estagio}
        options={{ title: 'Estágio' }}
      />
      <Stack.Screen
        name="Aprendiz"
        component={Aprendiz}
        options={{ title: 'Aprendiz' }}
      />
      <Stack.Screen name="Vagas" component={Vagas} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: { backgroundColor: '#00FF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="Details"
        component={PassoUm}
        options={{ title: 'Details Page' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return <NavigationContainer>{HomeStack()}</NavigationContainer>;
}

export default App;
