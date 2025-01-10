import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const { width, height } = Dimensions.get('window');

const Inventario = ({ navigation }) => {
  const [badge, setBadge] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
  
          const badgeRef = doc(db, 'insignia', '7'); 
          const badgeSnapshot = await getDoc(badgeRef);

          if (badgeSnapshot.exists()) {
            const badgeData = badgeSnapshot.data();
            console.log('Dados da Insígnia:', badgeData); 
            setBadge(badgeData); 
          } else {
            console.log('Insígnia não encontrada.');
            setBadge(null);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar insígnias:', error);
      }
    };

    const fetchImage = async () => {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, 'rdb.png');
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Erro ao buscar a imagem do Storage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadgeData();
    fetchImage();
  }, []);

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

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? ( 
          <ActivityIndicator size="large" color="#7ed758" />
        ) : (
          <View style={styles.qrCodeBackground}>
            <Text style={styles.foundText}>Encontrada:</Text>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.badgeImage} />
            ) : (
              <Text style={styles.errorText}>Imagem não encontrada.</Text>
            )}
            {badge ? (
              <>
                <Text style={styles.badgeTitle}>{badge.nome || 'Nome não encontrado'}</Text>
                <Text style={styles.badgeDescription}>{badge.descricao || 'Descrição não encontrada'}</Text>
                <Text style={styles.badgeRarity}>Raridade: {badge.raridade || 'Raridade não encontrada'}</Text>
              </>
            ) : (
              <Text style={styles.errorText}>Insígnia não encontrada.</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Image source={require('../../imgs/bau.png')} style={styles.iconBottom} />
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  qrCodeBackground: {
    backgroundColor: '#f2f2f2',
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: 'center',
    width: width * 0.9,
    marginBottom: 20,
  },
  foundText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#ff5733',
    marginBottom: 10,
  },
  badgeImage: {
    width: width * 0.6,
    height: width * 0.4,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  badgeTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  badgeDescription: {
    fontSize: width * 0.04,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  badgeRarity: {
    fontSize: width * 0.05,
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
  errorText: {
    fontSize: width * 0.05,
    color: '#f00',
  },
});

export default Inventario;