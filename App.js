import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Telas/Login/login'
import Cadastro from './Telas/Cadastro/cadastro';
import Inicio from './Telas/Inicio/inicio'
import Senha from './Telas/Senha/Senha'
import Inventario from './Telas/Inventario/Inventario';
import User from './Telas/User/user';
import Membros from './Telas/Membros/membros';
import QRScanner from './Telas/QRScanner';
 

const Stack = createStackNavigator();

const App = () => { 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} 
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
      <Stack.Screen
        name="Inventario"
        component={Inventario}
        options={{ headerShown: false }} 
      />
            <Stack.Screen
        name="User"
        component={User} 
        options={{ headerShown: false }} 
      />
                  <Stack.Screen
        name="Membros"
        component={Membros} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="QRScanner"
        component={QRScanner} 
        options={{ headerShown: false }} 
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
