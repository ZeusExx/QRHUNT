import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { deleteDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const User = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid, 'user', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log('Nenhum documento encontrado para o usuário. Criando documento...');
            await setDoc(userDocRef, { email: user.email, userId: user.uid });
            setUserData({ email: user.email, userId: user.uid });
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
      console.log(result.assets[0].uri); 
      setUploading(true);

      const resizedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800, height: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      await updateProfileImage(resizedImage.uri); 
    }
  };

  const updateProfileImage = async (uri) => {
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid, 'user', user.uid);

      const storageRef = ref(storage, `Profile/${user.uid}.jpg`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const photoURL = await getDownloadURL(storageRef);

      await updateDoc(userDocRef, { photoURL });
      setUserData((prevData) => ({ ...prevData, photoURL }));
    } catch (error) {
      console.log('Erro ao atualizar a imagem de perfil:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    const userDocRef = doc(db, 'users', user.uid, 'user', user.uid);
    const storageRef = ref(storage, `Profile/${user.uid}.jpg`);

    Alert.alert(
      'Excluir Conta',
      'Você tem certeza que deseja excluir sua conta? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteObject(storageRef);
              console.log('Foto de perfil excluída.');
              await deleteDoc(userDocRef);
              console.log('Dados do usuário excluídos do Firestore.');
              await user.delete();
              console.log('Conta excluída do Firebase Authentication.');
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erro ao excluir a conta:', error);
              Alert.alert('Erro', 'Não foi possível excluir sua conta. Tente novamente.');
            }
          },
        },
      ],
      { cancelable: false }
    );
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
      </View>

      <View style={styles.content}>
        {userData ? (
          <>
            <View style={styles.profileImageContainer}>
              <View style={styles.glowEffect} />
              {userData.photoURL ? (
                <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
              ) : (
                <Text style={styles.text}>Sem foto de perfil</Text>
              )}
              <TouchableOpacity style={styles.editButton} onPress={openGallery}>
                <Text style={styles.editButtonText}>
                  {userData.photoURL ? 'Editar Foto' : 'Adicionar Foto'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emailContainer}>
              <Text style={styles.emailText}>E-mail: {auth.currentUser?.email}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>SAIR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
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
    justifyContent: 'space-between',
    paddingTop: height * 0.05, 
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7ed758',
    paddingHorizontal: width * 0.04,
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
  logoutButton: {
    marginTop: height * 0.03,
    padding: width * 0.04,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  text: {
    fontSize: width * 0.05,
    color: '#333',
    fontWeight: 'bold',
    marginTop: height * 0.02,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.05,
    position: 'relative',
  },
  profileImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    borderWidth: 8,
    borderColor: '#7ed758',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  glowEffect: {
    position: 'absolute',
    width: width * 0.68,
    height: width * 0.68,
    borderRadius: width * 0.34,
    borderWidth: 2,
    borderColor: 'rgba(126, 215, 88, 0.6)',
    zIndex: -1,
  },
  editButton: {
    marginTop: height * 0.02, 
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emailContainer: {
    backgroundColor: '#F1F1F1',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
    marginTop: height * 0.02,
  },
  emailText: {
    fontSize: width * 0.05,
    color: '#333',
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7ed758',
    paddingHorizontal: width * 0.2,
    paddingVertical: height * 0.02,
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
  deleteButton: {
    marginTop: height * 0.03,
    padding: width * 0.04,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default User;
