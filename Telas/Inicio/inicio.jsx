import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const Inicio = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
        
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

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para acessar a câmera foi negada.');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        console.log(result.uri);
      }
    } catch (error) {
      console.error('Erro ao abrir a câmera:', error);
      Alert.alert('Erro', 'Algo deu errado ao tentar acessar a câmera.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require('../../imgs/logoqr.png')} style={styles.logo} />
        <Text style={styles.title}>QRHUNT</Text>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Image source={require('../../imgs/user.png')} style={styles.icon} />
        </TouchableOpacity>

      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          {user ? `Bem-vindo, ${userName}` : 'Nenhum conteúdo disponível no momento'}
        </Text>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Inventario')}>
          <Image source={require('../../imgs/bau.png')} style={styles.iconBottom} />
        </TouchableOpacity>

        <View style={styles.separator} />
        
        <TouchableOpacity onPress={openCamera}>
          <Image source={require('../../imgs/camera.png')} style={styles.iconBottom} />
        </TouchableOpacity>

        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigation.navigate('Membros')}>
        <Image source={require('../../imgs/membros.png')} style={styles.iconBottom} />
        </TouchableOpacity>
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
    padding: 20,
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
