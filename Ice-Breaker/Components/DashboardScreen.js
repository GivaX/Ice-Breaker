import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

const DashboardScreen = ({ navigation }) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://10.155.169.130:3001/api/checkpipes`); // Replace with fetch if needed
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{`Error: ${error}`}</Text>;

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                autoDismiss: false,
                title: 'Test Notification',
                body: 'This is an example notification triggered 5secs after a button press',
                sound: true,
            },
            trigger: { seconds: 10 },
        });
        console.log('Notification Sent');
    };

    return (
        <View style={styles.container}>
             <FlatList
                data={data}
                keyExtractor={(item) => item.pipeName} // Assuming pipeName is unique
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{`Pipe: ${item.pipeName}`}</Text>
                        <Text>{`Current Volume: ${item.currentVolume}`}</Text>
                        <Text>{`Target Volume: ${item.targetVolume}`}</Text>
                        <Text>{`Valve Open: ${item.valveOpenPercentage}`}</Text>
                    </View>
                )}
            />
            <Text style={styles.title}>Dashboard</Text>
            {/* Add your components here */}      
            <Button
                title="Go to SaiScreen"
                onPress={() => navigation.navigate('SaiScreen')}
            />
            <Button
                title="Send Notification"
                onPress={sendNotification}
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