import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from "firebase/auth"; // Importe a função necessária para redefinir a senha
import { auth } from '../../Firebase/config';

const Senha = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const handleResetPassword = async () => {
        setError(null);
        try {
            // Chame a função para enviar o email de redefinição de senha
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Email de redefinição enviado com sucesso!");
            setEmail('');
        } catch (err) {
            console.error('Erro ao enviar email de redefinição:', err);
            let errorMessage = 'Erro ao enviar email de redefinição. Verifique seu email e tente novamente.';
            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Por favor, insira um email válido.';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'Usuário não encontrado. Verifique o email inserido.';
            }
            setError(errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.formContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>QRHUNT</Text>
                    <Image
                        source={require('../../imgs/qrhunt.png')} // Substitua o caminho pelo seu arquivo de imagem
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
    formContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 10,
        padding: 20,
        elevation: 4,
        marginVertical: 20, // Espaçamento vertical ao redor do formulário
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000', // Cor do texto do logo
    },
    logoImage: {
        width: 150, // Largura da imagem do logo
        height: 150, // Altura da imagem do logo
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
    input: {
        height: 40,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#555555',
        borderRadius: 10,
        paddingHorizontal: 8,
        backgroundColor: '#ffffff',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#000000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
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

export default Senha;
