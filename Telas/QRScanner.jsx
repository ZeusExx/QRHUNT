import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const QRScanner = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);

  const qrToImageMap = {
    "eca!.jpeg": "eca!.png",
    "bnb.jpeg": "bnb.png",
    "cafofo.jpeg": "cafofo.png",
    "edm.jpeg": "edm.png",
    "ifc.jpeg": "ifc.png",
    "rdb.jpeg": "rdb.png",
    "virgula.jpeg": "virgula.png",
  };

  const handleBarCodeRead = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    if (qrToImageMap[data]) {
      try {
        const matchedImage = qrToImageMap[data];

        const db = getFirestore();
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const userRef = doc(db, 'user', user.uid); // Alterado para buscar diretamente pelo uid
        const userSnap = await getDoc(userRef);
        const currentInventory = userSnap.data()?.inventario || [];

        if (!currentInventory.includes(matchedImage)) {
          await updateDoc(userRef, {
            inventario: [...currentInventory, matchedImage],
          });
          Alert.alert('Sucesso', `Imagem "${matchedImage}" adicionada ao inventário!`);
        } else {
          Alert.alert('Aviso', `"${matchedImage}" já está no inventário.`);
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao atualizar o inventário.');
        console.error(error);
      }
    } else {
      Alert.alert('QR Code inválido', 'O QR code lido não corresponde a nenhum item.');
    }
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
        flashMode={RNCamera.Constants.FlashMode.off}
        type={RNCamera.Constants.Type.back} // Teste alterando para .Type.front
      >
        <View style={styles.overlay} />
        <Text style={styles.instruction}>Posicione o QR Code no centro</Text>
        <View style={styles.overlay} />
      </RNCamera>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
  instruction: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '10%', 
    left: '50%',
    transform: [{ translateX: -width * 0.25 }],
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FF6347',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  backText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default QRScanner;
