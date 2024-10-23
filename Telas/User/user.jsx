import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importe as funções do Firebase Storage
import { db } from '../../Firebase/config';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const User = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const storage = getStorage(); // Inicialize o Firebase Storage

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
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
          setLoading(false);
        }
      } else {
        console.log('Usuário não autenticado.');
        setUserData({});
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar a galeria foi negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri); // Exibe a URI da imagem
      // Atualizar a foto no Firestore
      await updateProfileImage(result.assets[0].uri);
    }
  };

  const updateProfileImage = async (uri) => {
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);

      const storageRef = ref(storage, `perfil/${user.uid}.jpg`); 
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const photoURL = await getDownloadURL(storageRef);

      await updateDoc(userDocRef, { photoURL });
      setUserData(prevData => ({ ...prevData, photoURL })); 
    } catch (error) {
      console.log('Erro ao atualizar a imagem de perfil:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
          <Image source={require('../../imgs/logoqr.png')} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.title}>QRHUNT</Text>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Image source={require('../../imgs/user.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image source={require('../../imgs/lupa.png')} style={styles.icon} />
      </View>

      <View style={styles.content}>
        {userData ? (
          <>
            {userData.photoURL ? (
              <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
            ) : (
              <Text style={styles.text}>Sem foto de perfil</Text>
            )}
            <Text style={styles.text}>E-mail: {auth.currentUser?.email}</Text>

            <TouchableOpacity style={styles.button} onPress={openGallery}>
              <Text style={styles.buttonText}>Selecionar Imagem</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.text}>Nenhum dado encontrado.</Text>
        )}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Inventario')}>
          <Image source={require('../../imgs/bau.png')} style={styles.iconBottom} />
        </TouchableOpacity>

        <View style={styles.separator} />

        <Image source={require('../../imgs/membros.png')} style={styles.iconBottom} />
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
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
