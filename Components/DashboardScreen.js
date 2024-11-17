import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native';

const DashboardScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            {/* Add your dashboard components here */}
        <Button
            title="Go to SaiScreen"
            onPress={() => navigation.navigate('SaiScreen')}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default DashboardScreen;