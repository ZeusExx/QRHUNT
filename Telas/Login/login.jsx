import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../Firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";

import Mostra from '../../imgs/OnIcon.png';
import Esconda from '../../imgs/OffIcon.png';

const { width, height } = Dimensions.get('window');

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);


    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Login feito com sucesso!");
            setEmail('');
            setPassword('');
            navigation.navigate('Inicio');
        } catch (err) {

            console.error('Erro durante o login:', err); 
            
            setError("Verifique suas credenciais e tente novamente.");
        }
    };
    
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>QRHUNT</Text>
                <Image
                    source={require('../../imgs/qrhunt.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {/* Container para o formulário */}
            <View style={styles.formContainer}>
                {error && <Text style={styles.error}>{error}</Text>}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputWithIcon}>
                        <Image
                            source={require('../../imgs/email.png')}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu email"
                            placeholderTextColor="#555555"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textAlign="center"
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Senha</Text>
                    <View style={styles.inputWithIcon}>
                        <Image
                            source={require('../../imgs/cadeado.png')}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Coloque sua senha"
                            placeholderTextColor="#555555"
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={!showPassword}
                            textAlign="center"
                        />
                        <TouchableOpacity
                            style={styles.visibilityIcon}
                            onPress={togglePasswordVisibility}
                        >
                            <Image
                                source={showPassword ? Mostra : Esconda}
                                style={styles.visibilityIconImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Botão de Login */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.registerLink}
                    onPress={() => navigation.navigate('Cadastro')}
                >
                    <Text style={styles.registerLinkText}>Não tem uma conta? Cadastre-se</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.registerLink}
                    onPress={() => navigation.navigate('Senha')}
                >
                    <Text style={styles.registerLinkText}>Esqueceu a senha?</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5cb85c',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.05,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    logo: {
        fontSize: width * 0.1, 
        fontWeight: 'bold',
        color: '#ffffff', 
        textShadowColor: '#000000', 
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 6, 
        letterSpacing: 5, 
        fontFamily: 'Roboto', 
        marginTop: 10,
    },
    logoImage: {
        width: width * 0.4,
        height: width * 0.4,
        marginTop: 10,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 10,
        padding: width * 0.04,
        elevation: 4,
        backgroundColor: '#5cb85c',
        borderColor: '#a0a0a0', 
        borderWidth: 1, 
        shadowColor: '#000', 
        shadowOffset: { width: 0.8, height: 0.8 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 10, 
    },
    inputContainer: {
        marginBottom: height * 0.02,
    },
    inputLabel: {
        marginBottom: 5,
        color: 'black',
        fontSize: width * 0.04,
        textAlign: 'center',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: width * 0.02,
        backgroundColor: '#ffffff',
        width: '100%',  
    },
    input: {
        flex: 1,
        height: height * 0.07,  
        fontSize: width * 0.04,
        paddingVertical: height * 0.01, 
    },
    inputIcon: {
        width: width * 0.07,
        height: width * 0.07,
        tintColor: '#555555',
        marginRight: 5,
    },
    visibilityIcon: {
        padding: 10,
    },
    visibilityIconImage: {
        width: width * 0.06,
        height: width * 0.06,
        tintColor: '#555555',
    },
    buttonContainer: {
        width: '100%',
        marginTop: height * 0.02,
    },
    loginButton: {
        backgroundColor: '#000000',
        paddingVertical: height * 0.02,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: width * 0.05,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: height * 0.01,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: width * 0.04,
        color: '#000000',
        textDecorationLine: 'underline',
    },
    error: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        color: 'red',
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'red',
        overflow: 'hidden',
    },
});

export default Login;
