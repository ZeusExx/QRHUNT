import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../../Firebase/config'; 

const Gerador = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrData, setQrData] = useState(null);

  // Função para abrir a galeria e escolher uma imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
      uploadImageToFirebase(result.uri);  // Envia a imagem para o Firebase
    }
  };

  // Função para fazer upload da imagem para o Firebase Storage e gerar a URL
  const uploadImageToFirebase = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, `insignias/${Date.now()}.jpg`);

    // Faz o upload da imagem
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log('Imagem enviada com sucesso!');
      // Recupera a URL de download da imagem
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setQrData(downloadURL);  // Usa a URL da imagem para o QR code
      });
    }).catch((error) => {
      console.log("Erro ao enviar a imagem: ", error);
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Escolher Imagem" onPress={pickImage} />
      
      {/* Exibir a imagem escolhida */}
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}

      {/* Exibir o QR Code após a URL da imagem ser gerada */}
      {qrData && (
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}  // Dado que será convertido em QR code (a URL da imagem)
            size={200}       // Tamanho do QR code
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  qrContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default Gerador;
