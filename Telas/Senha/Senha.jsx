import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from '../../Firebase/config';
import { collection, query, where, getDocs } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

const Senha = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const handleResetPassword = async () => {
        setError(null);

        if (!email.trim()) {
            setError('Por favor, insira um email.');
            return;
        }

        try {
            const usersRef = collection(db, 'user');
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Usuário não encontrado. Verifique o email inserido.');
                return;
            }

            await sendPasswordResetEmail(auth, email);
            Alert.alert("Email de redefinição enviado com sucesso!");
            setEmail('');
        } catch (err) {
            console.error('Erro ao enviar email de redefinição:', err);
            let errorMessage = 'Erro ao enviar email de redefinição. Verifique seu email e tente novamente.';
            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Por favor, insira um email válido.';
            }
            setError(errorMessage);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <KeyboardAvoidingView
                    style={styles.formContainer}
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
                    {error && <Text style={styles.error}>{error}</Text>}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
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

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleResetPassword}
                        >
                            <Text style={styles.resetButtonText}>Redefinir Senha</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.registerLinkText}>Voltar para o Login</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#5cb85c',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 10,
        padding: width * 0.05,
        backgroundColor: '#5cb85c',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: height * 0.03,
    },
    logo: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        color: '#ffffff',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
        letterSpacing: 5,
    },
    logoImage: {
        width: width * 0.3,
        height: width * 0.3,
    },
    inputContainer: {
        marginBottom: height * 0.02,
    },
    inputLabel: {
        marginBottom: 8,
        color: 'black',
        fontSize: width * 0.04,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        minHeight: height * 0.06,
        fontSize: width * 0.045,
        lineHeight: width * 0.05,
        borderWidth: 1,
        borderColor: '#555555',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: height * 0.015,
        backgroundColor: '#ffffff',
        textAlignVertical: 'center',
    },
    buttonContainer: {
        marginTop: height * 0.02,
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#000000',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.1,
        borderRadius: 10,
    },
    resetButtonText: {
        fontSize: width * 0.04,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: height * 0.03, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerLinkText: {
        fontSize: width * 0.04,
        color: '#000000',
        textDecorationLine: 'underline',
        textAlign: 'center',
        paddingVertical: height * 0.01,
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
    },
});

export default Senha;
