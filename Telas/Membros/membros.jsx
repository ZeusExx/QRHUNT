
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const Membros = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);

        const displayName = currentUser.displayName || currentUser.email.split('@')[0];
        setUserName(displayName);
        fetchMembers(currentUser); 
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

  const fetchMembers = async (currentUser) => {
    const db = getFirestore();
    const membersCollection = collection(db, 'user');
    try {
      const querySnapshot = await getDocs(membersCollection);
      const membersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email,
        badges: doc.data().badges || 0, 
      }));
      setMembers(membersList.filter(member => member.email !== currentUser.email)); 
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os membros.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.memberContainer}>
      <Text style={styles.memberEmail}> Usuário : {item.email.split('@')[0]} ,</Text>
      <Text style={styles.memberBadges}> Insígnias : {item.badges}</Text>
    </View>
  );

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
        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
          <Image source={require('../../imgs/logoqr.png')} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.title}>QRHUNT</Text>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Image source={require('../../imgs/user.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          {user ? `Bem-vindo, ${userName}` : 'Nenhum conteúdo disponível no momento'}
        </Text>
        <FlatList
          data={members}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.memberList}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Inventario')}>
          <Image source={require('../../imgs/bau.png')} style={styles.iconBottom} />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
          <Image source={require('../../imgs/camera.png')} style={styles.iconBottom} />
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
    justifyContent: 'space-between',
    paddingTop: height * 0.05, 
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7ed758',
    paddingHorizontal: width * 0.05,
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
    padding: width * 0.05,  
  },
  welcomeText: {
    fontSize: width * 0.05, 
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.03,  
  },
  memberList: {
    width: '100%', 
    paddingBottom: height * 0.02,  
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.02,  
    paddingHorizontal: width * 0.05, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d1d1', 
    marginVertical: height * 0.01, 
    width: '100%',  
  },
  memberEmail: {
    fontSize: width * 0.04,  
    color: '#000',
    flex: 1, 
  },
  memberBadges: {
    fontSize: width * 0.04,  
    color: '#000',
    flex: 1,  
    textAlign: 'right', 
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7ed758',
    paddingHorizontal: width * 0.05,
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
});

export default Membros;
