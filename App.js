import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Telas/USERS/Login/login'
import Cadastro from './Telas/USERS/Cadastro/cadastro';
import Inicio from './Telas/USERS/Inicio/inicio'
import Senha from './Telas/USERS/Senha/Senha'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Oculta o cabeçalho da tela de Login
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Senha"
        component={Senha}
        options={{ headerShown: false }} 
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
