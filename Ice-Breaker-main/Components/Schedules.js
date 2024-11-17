import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

const Schedules = ({navigation}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://10.155.169.130:8555/api/alertapp`); // Replace with fetch if needed
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        (async () => {
            const dir = FileSystem.documentDirectory; // Example: Use the document directory
            console.log('Directory:', dir);
            const csvFiles = await findCSVFiles('../utils/');
            console.log('CSV Files:', csvFiles);
        })();

        fetchData();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{`Error: ${error}`}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{data}</Text>
            {/* Add your dashboard components here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#293741',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
});

export default Schedules;