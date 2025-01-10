import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const QRScanner = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false); // Controla o estado da câmera
  const cameraRef = useRef(null);

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
    if (!isCameraReady || scanned) return; // Só processa o QR code se a câmera estiver pronta

    setScanned(true);

    if (qrToImageMap[data]) {
      try {
        const matchedImage = qrToImageMap[data];

        const db = getFirestore();
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const userRef = doc(db, 'user', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const currentInventory = userSnap.data()?.inventario || [];

          if (!currentInventory.includes(matchedImage)) {
            await updateDoc(userRef, {
              inventario: [...currentInventory, matchedImage],
            });
            Alert.alert('Sucesso', `Imagem "${matchedImage}" adicionada ao inventário!`);
          } else {
            Alert.alert('Aviso', `"${matchedImage}" já está no inventário.`);
          }
        } else {
          Alert.alert('Erro', 'Usuário não encontrado.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao atualizar o inventário.');
        console.error(error);
      }
    } else {
      Alert.alert('QR Code inválido', 'O QR code lido não corresponde a nenhum item.');
    }

    setTimeout(() => setScanned(false), 1000);
  };

  const onCameraReady = () => {
    setIsCameraReady(true); // Marca a câmera como pronta
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        onBarCodeRead={isCameraReady ? handleBarCodeRead : undefined} // Só chama o evento quando a câmera estiver pronta
        captureAudio={false}
        flashMode={RNCamera.Constants.FlashMode.off}
        type={RNCamera.Constants.Type.back}
        onCameraReady={onCameraReady} // Marca a câmera como pronta
        androidCameraPermissionOptions={{
          title: 'Permissão para usar a câmera',
          message: 'Nós precisamos de permissão para usar a câmera',
          buttonPositive: 'OK',
          buttonNegative: 'Cancelar',
        }}
        iosCameraPermissionDialogMessage="Nós precisamos de permissão para usar a câmera"
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Cor do fundo para deixar o QR code visível
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
