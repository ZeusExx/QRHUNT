import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../Firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";

// Importe os ícones para mostrar/ocultar a senha
import Mostra from '../../imgs/OnIcon.png';
import Esconda from '../../imgs/OffIcon.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State to store error messages
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigation = useNavigation();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000); // Clear the error after 3 seconds

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
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
            navigation.navigate('Inicio'); // Redirecionar para a tela de início
        } catch (err) {
            console.error('Erro durante o login:', err); // Exibir o erro completo no console
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
        setShowPassword(!showPassword); // Inverte o estado atual de showPassword
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>QRHUNT</Text>
                <Image
                    source={require('../../imgs/qrhunt.png')} // Substitua o caminho pelo seu arquivo de imagem
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.formContainer}>
                {error && <Text style={styles.error}>{error}</Text>}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputWithIcon}>
                        <Image
                            source={require('../../imgs/email.png')} // Substitua pelo ícone desejado
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu email"
                            placeholderTextColor="#555555" // Cor do placeholder
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textAlign="center" // Alinha o texto no centro horizontalmente
                        />

                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Senha</Text>
                    <View style={styles.inputWithIcon}>
                        <Image
                            source={require('../../imgs/cadeado.png')} // Substitua pelo ícone desejado
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Coloque sua senha"
                            placeholderTextColor="#555555" // Cor do placeholder
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={!showPassword}
                            textAlign="center" // Alinha o texto no centro horizontalmente
                        />
                        <TouchableOpacity
                            style={styles.visibilityIcon}
                            onPress={togglePasswordVisibility}
                        >
                            <Image
                                source={showPassword ? Mostra : Esconda} // Mostra o ícone correspondente ao estado de showPassword
                                style={styles.visibilityIconImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
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
        padding: 20,
        elevation: 4,
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
