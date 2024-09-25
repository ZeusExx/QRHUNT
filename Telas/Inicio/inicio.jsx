import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

const Inicio = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <Image
          source={require('../../imgs/logoqr.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>QRHUNT</Text>
        <Image
          source={require('../../imgs/user.png')}
          style={styles.icon}
        />
        <Image
          source={require('../../imgs/lupa.png')}
          style={styles.icon}
        />
      </View>


      <View style={styles.content}>
        <ImageBackground
          source={require('../../imgs/urso.png')} 
          style={styles.imageBackground}
        >
          <Text style={styles.welcomeText}>Nenhuma insígnia no momento</Text>
        </ImageBackground>
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <Image
          source={require('../../imgs/bau.png')}
          style={styles.iconBottom}
        />
        <View style={styles.separator} />
        <Image
          source={require('../../imgs/camera.png')}
          style={styles.iconBottom}
        />
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
  imageBackground: {
    width: width * 0.9, 
    height: width * 0.9,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  welcomeText: {
    fontSize: width * 0.06,
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
});

export default Inicio;
