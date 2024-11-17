import React,  { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Button } from 'react-native';
//import * as Notifications from 'expo-notifications';
import axios from 'axios';

const DashboardScreen = ({navigation}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://10.155.169.130:8555/api/checkpipes`); // Replace with fetch if needed
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

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Card 1 */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Current Hydrates</Text>
                <Text style={styles.cardContent}>NONE</Text>
            </View>

            {/* Card 2 */}
            <View style={styles.card2}>
                <Text style={styles.cardTitle2}>EOG Resources</Text>
                <Text style={styles.cardContent2}>Richardson, TX</Text>
            </View>

            {/* Parent container for the side-by-side cards */}
            <View style={styles.sidecontainer}>
                <View style={styles.cardsRow}>
                    {/* Card 1 */}
                    <View style={styles.rowcard}>
                        <Image
                            source={{ uri: 'https://www.fortcommunity.com/_/kcms-doc/1231/81007/MoneyFund.png' }} // Image URL
                            style={styles.image} // Styling for the image
                        />
                    </View>

                    {/* Card 2 */}
                    <View style={styles.rowcard}>
                        <Image
                            source={{ uri: 'https://www.fortcommunity.com/_/kcms-doc/1231/81007/MoneyFund.png' }} // Image URL
                            style={styles.image} // Styling for the image
                        />
                    </View>
                </View>
            </View>

            {/* Button to navigate to Valve */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ValveTrends')}
            >
                <Text style={styles.buttonText}>Review Data</Text>
            </TouchableOpacity>


            {/* Button to navigate to Schedule */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Schedules')}
            >
                <Text style={styles.buttonText}>Review Repairs</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#293741'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
    },
    card: {
        width: '90%',
        height: "15%",
        justifyContent: 'center',
        backgroundColor: '#3B576A',
        padding: 20,
        marginVertical: 25,
        borderRadius: 10,
    },
    rowcard: {
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#3B576A',
        width: '44%', // Cards take up 48% of the row's width
        marginHorizontal: '4%', // Adds space between cards
        justifyContent: 'center', // Center image vertically within the container
        alignItems: 'center'
    },
    card2: {
        width: '90%',
        //flexGrow: 1,
        height: '15%',
        backgroundColor: '#293741',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#fff",
    },
    cardTitle2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fff",
    },
    cardContent: {
        fontSize: 16,
        marginTop: 10,
        color: "#fff",
        textAlign: 'center',
    },
    cardContent2: {
        fontSize: 16,
        marginTop: 10,
        color: "#fff",
    },
    button: {
        backgroundColor: '#7CB9E8',
        width: "90%",
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sidecontainer: {
        flexDirection: 'row', // Aligns children side by side (horizontally)
        justifyContent: 'center', // Creates space between the cards
        width: '100%', // Ensure parent takes up most of the screen width
        height: '20%',
        paddingHorizontal: 1, // Optional: Add horizontal padding
        backgroundColor: '#293741',
        marginBottom: 30
    },
    cardsRow: {
        flexDirection: 'row', // Aligns children side by side (horizontally)
        justifyContent: 'center', // Create space between the cards
        width: '100%', // Ensure it spans the full width of the parent container
        paddingHorizontal: 10,
        backgroundColor: '#293741'
    },
    image: {
        width: 100,
        height: 100,
    },
});

export default DashboardScreen;
