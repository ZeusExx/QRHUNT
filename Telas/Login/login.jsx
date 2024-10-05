import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../Firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";

import Mostra from '../../imgs/OnIcon.png';
import Esconda from '../../imgs/OffIcon.png';

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
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Login feito com sucesso!");
            setEmail('');
            setPassword('');
            setError(null);
            navigation.navigate('Inicio');
        } catch (err) {
            console.error('Erro durante o login:', err);
            let errorMessage = 'Erro ao fazer login. Verifique suas credenciais e tente novamente.';
            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Por favor, insira um e-mail válido.';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Senha incorreta. Tente novamente.';
            }
            setError(errorMessage);
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
        padding: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    logoImage: {
        width: 150,
        height: 150,
        marginTop: 10,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 10,
        padding: 10, // Espaço ajustado
        elevation: 4,
        backgroundColor: '#5cb85c',
        borderColor: '#a0a0a0', // Cor da borda
        borderWidth: 1, // Largura da borda
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0.8, height: 0.8 }, // Offset da sombra
        shadowOpacity: 0.8, // Opacidade da sombra
        shadowRadius: 10, 
    },
    inputContainer: {
        marginBottom: 12,
    },
    inputLabel: {
        marginBottom: 2,
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        backgroundColor: '#ffffff',
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 14,
    },
    inputIcon: {
        width: 20,
        height: 20,
        tintColor: '#555555',
        marginRight: 1,
    },
    visibilityIcon: {
        position: 'absolute',
        right: 12,
        padding: 10,
    },
    visibilityIconImage: {
        width: 20,
        height: 20,
        tintColor: '#555555',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    loginButton: {
        backgroundColor: '#000000',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: 8,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: 14,
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
