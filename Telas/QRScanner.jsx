import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

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
        const userRef = doc(db, 'user', user.uid, 'user', user.uid);

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
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  instruction: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  backText: {
    fontSize: 16,
    color: '#000',
  },
});

export default QRScanner;
