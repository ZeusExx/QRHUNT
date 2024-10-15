import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker'; 
import Inventario from '../Inventario/Inventario';
import Gerador from '../Gerador/Gerador';

const { width, height } = Dimensions.get('window');

const Inicio = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(''); // Novo estado para armazenar o nome do usuário

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
        
        // Verifica se o usuário tem um displayName, caso contrário usa o email
        const displayName = currentUser.displayName || currentUser.email.split('@')[0];
        setUserName(displayName);
      } else {
        await AsyncStorage.removeItem('user');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  // Função para abrir a câmera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar a câmera foi negada.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Permite ao usuário editar a imagem
      aspect: [4, 3], // Define a proporção da imagem
      quality: 1, // Define a qualidade da imagem
    });

    if (!result.cancelled) {
      console.log(result.uri); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <Image
          source={require('../../imgs/logoqr.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>QRHUNT</Text>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <Image
          source={require('../../imgs/user.png')}
          style={styles.icon}
        />
        </TouchableOpacity>
        <Image
          source={require('../../imgs/lupa.png')}
          style={styles.icon}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          {user ? `Bem-vindo, ${userName}` : 'Nenhuma insígnia no momento'}
        </Text>
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Inventario')}>
          <Image
            source={require('../../imgs/bau.png')}
            style={styles.iconBottom}
          />
        </TouchableOpacity>

        <View style={styles.separator} />
        
        <TouchableOpacity onPress={openCamera}>
          <Image
            source={require('../../imgs/camera.png')}
            style={styles.iconBottom}
          />
        </TouchableOpacity>

        <View style={styles.separator} />
        <Image
          source={require('../../imgs/membros.png')}
          style={styles.iconBottom}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ed758',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7ed758',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.02,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.1,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7ed758',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
  },
  iconBottom: {
    width: width * 0.1,
    height: width * 0.1,
  },
  separator: {
    width: 2,
    height: width * 0.1,
    backgroundColor: '#000',
  },
});

export default Inicio;
