import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const User = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Adiciona estado de carregamento
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      // Verifique se o usuário está autenticado
      if (user) {
        try {
          // Referenciando o documento do usuário na coleção 'users'
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log('Nenhum documento encontrado para o usuário.');
            setUserData({});
          }
        } catch (error) {
          console.log('Erro ao buscar dados do Firestore:', error);
          setUserData({});
        } finally {
          setLoading(false); // Define loading como false após a busca
        }
      } else {
        console.log('Usuário não autenticado.');
        setUserData({});
        setLoading(false); // Define loading como false se o usuário não estiver autenticado
      }
    };

    fetchUserData();
  }, [auth]);

  // Mostre um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

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
      <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
        <Image
          source={require('../../imgs/logoqr.png')}
          style={styles.logo}
        />
        </TouchableOpacity>
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
        {userData ? (
          <>
            <Text style={styles.text}>Nome: {userData.nome || 'Sem nome'}</Text>
            <Text style={styles.text}>E-mail: {auth.currentUser?.email}</Text>

            {userData.photoURL ? (
              <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
            ) : (
              <Text style={styles.text}>Sem foto de perfil</Text>
            )}
          </>
        ) : (
          <Text style={styles.text}>Nenhum dado encontrado.</Text>
        )}
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
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 16,
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

export default User;
