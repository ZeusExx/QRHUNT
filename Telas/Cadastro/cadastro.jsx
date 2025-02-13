import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../Firebase/config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

import Mostra from '../../imgs/OnIcon.png';
import Esconda from '../../imgs/OffIcon.png';

const Cadastro = () => {
    const [user, setUser] = useState('');
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignup = async () => {
        setError(null);
    
        if (user.length < 3) {
            setError('O usuário deve ter pelo menos 3 caracteres.');
            return;
        }
    
        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userFirebase = userCredential.user;
    
            const userDoc = await addDoc(collection(db, "user"), {
                email: email,
                nome: user,
                userId: userFirebase.uid, 
            });
    
            await addDoc(collection(db, `user/${userDoc.id}/badges`), {
                initial: "Nenhuma insígnia ainda",
            });
    
            Alert.alert('Cadastro feito com sucesso!', `Bem-vindo, ${user} !`);
            setUser('');
            setEmail('');
            setPassword('');
            navigation.navigate('Inicio');
        } catch (err) {
            console.error('Erro durante o cadastro:', err);
            let errorMessage = 'Erro ao cadastrar. Verifique suas informações e tente novamente.';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Este e-mail já está em uso. Por favor, escolha outro.';
            }
            setError(errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>QRHUNT</Text>
                <Image
                    source={require('../../imgs/qrhunt.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.title}>Cadastro</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.backgroundContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Usuário</Text>
                    <View style={styles.inputWithIcon}>
                        <Image
                            source={require('../../imgs/user.png')}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Crie um usuário"
                            placeholderTextColor="#555555"
                            value={user}
                            onChangeText={setUser}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={30}
                            textAlign="center" 
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputWithIcon}>
                        <Image
                            source={require('../../imgs/email.png')}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Coloque seu email"
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
                            placeholder="Crie uma senha"
                            placeholderTextColor="#555555"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword} 
                            maxLength={30}
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
            <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
                <Text style={styles.loginButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLinkText}>Já tem uma conta? Faça Login</Text>
            </TouchableOpacity>
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
        marginBottom: height * 0.02,
    },
    logo: {
        fontSize: 42, 
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
        height: height * 0.2,
        marginTop: height * 0.02,
    },
    title: {
        fontSize: height * 0.035,
        fontWeight: 'bold',
        marginBottom: height * 0.02,
    },
    backgroundContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 10,
        padding: 10, 
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
        marginBottom: height * 0.015,
        width: '100%',
    },
    inputLabel: {
        marginBottom: height * 0.005,
        color: 'black',
        fontSize: height * 0.02,
        textAlign: 'center',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: width * 0.02,
        backgroundColor: '#ffffff',
        height: height * 0.06,
    },
    input: {
        flex: 1,
        fontSize: height * 0.02,
        padding: height * 0.01,
    },
    inputIcon: {
        width: width * 0.05,
        height: width * 0.05,
        tintColor: '#555555',
        marginRight: width * 0.02,
    },
    visibilityIcon: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
    },
    visibilityIconImage: {
        width: width * 0.06,
        height: width * 0.06,
        tintColor: '#555555',
    },
    loginButton: {
        backgroundColor: '#000000',
        paddingVertical: height * 0.015,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: height * 0.01,
        width: '90%',
    },
    loginButtonText: {
        fontSize: height * 0.025,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: height * 0.01,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: height * 0.02,
        color: '#000000',
        textDecorationLine: 'underline',
    },
    error: {
        color: 'red',
        marginBottom: height * 0.02,
        textAlign: 'center',
    },
});

export default Cadastro;
