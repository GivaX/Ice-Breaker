import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SaiScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SAI</Text>
            {/* Add your dashboard components here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF6EC7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'red',
    },
});

export default SaiScreen;