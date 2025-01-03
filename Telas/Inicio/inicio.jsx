import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

const Inicio = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [insigniaData, setInsigniaData] = useState(null);

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

  useEffect(() => {
    const fetchInsignia = async () => {
      const db = getFirestore();
      const docRef = doc(db, 'insignia', '1'); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const storage = getStorage();
        const imageRef = ref(storage, data.img);
        const imageUrl = await getDownloadURL(imageRef);

        setInsigniaData({ ...data, imgUrl: imageUrl });
      } else {
        console.log('Documento não encontrado!');
      }
    };

    fetchInsignia();
  }, []);

  useEffect(() => {
    const handleUrl = async (url) => {
      const insigniaId = url.split('/').pop(); 

    
      const db = getFirestore();
      const docRef = doc(db, 'insignia', insigniaId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const insigniaData = docSnap.data();

        
        const user = await AsyncStorage.getItem('user');
        const currentUser = JSON.parse(user);

       
        const userRef = doc(db, 'user', currentUser.uid, 'user', currentUser.uid);
        await updateDoc(userRef, {
          inventario: [...(userRef.inventario || []), insigniaData],
        });

        console.log('Insignia adicionada ao inventário!');
      }
    };

    Linking.addEventListener('url', (event) => handleUrl(event.url));

    return () => {
      Linking.removeEventListener('url', (event) => handleUrl(event.url));
    };
  }, []);

  const GenerateQRCode = ({ insigniaId }) => {
    const qrValue = `exp://192.168.100.129:8081/insignia/${insigniaId}`; //http://localhost:8081

    return (
      <QRCode
        value={qrValue}
        size={200}
        color="black"
        backgroundColor="white"
      />
    );
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>
          {user ? `Bem-vindo, ${userName}` : 'Nenhum conteúdo disponível no momento'}
        </Text>

        {insigniaData ? (
          <View style={styles.insigniaContainer}>
            {insigniaData.imgUrl ? (
              <Image source={{ uri: insigniaData.imgUrl }} style={styles.insigniaImage} />
            ) : (
              <Text>Carregando imagem...</Text>
            )}
            <Text style={styles.insigniaDescription}>{insigniaData.descricao}</Text>
            <Text style={styles.insigniaRarity}>Raridade: {insigniaData.raridade} </Text>
            <Text> </Text>
            <GenerateQRCode insigniaId={insigniaData.id} />
          </View>
        ) : (
          <Text>Carregando insignia...</Text>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Inventario')}>
          <Image source={require('../../imgs/bau.png')} style={styles.iconBottom} />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
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
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000',
    marginTop: height * 0.02, 
  },
  insigniaContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  insigniaImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    objectFit: 'cover',
    marginBottom: 20,
  },
  insigniaDescription: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  insigniaRarity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5722',
    textAlign: 'center',
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
