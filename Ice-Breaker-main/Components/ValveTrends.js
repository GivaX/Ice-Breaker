import React, { useEffect, useState } from 'react';
import { View, Text,  ActivityIndicator, FlatList, StyleSheet, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset'; // Expo's Asset module to access local assets
import { Button } from 'react-native';
//import * as Notifications from 'expo-notifications';
import axios from 'axios';

/**
 * Finds all .csv files in a directory.
 * @param {string} dir - Directory to search in.
 * @returns {Promise<string[]>} - Array of filepaths to .csv files.
 */
async function findCSVFiles(dir) {
    try {
        const files = await FileSystem.readDirectoryAsync(dir);
        const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
        return csvFiles.map(file => `${dir}/${file}`); // Append the directory path to each file
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

const ValveTrends = ({ navigation }) => {
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
        (async () => {
            const dir = FileSystem.documentDirectory; // Example: Use the document directory
            const csvFiles = await findCSVFiles('./Ice-Breaker-main/assets');
            console.log('CSV Files:', csvFiles);
        })();

        fetchData();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{`Error: ${error}`}</Text>;

    // useEffect(() => {
    //     // const loadCSVData = async () => {
    //     //     try {
    //     //         // Load CSV file from assets using Expo's Asset module
    //     //         const asset = Asset.fromModule(require('../assets/Bold.csv')); // Ensure the path is correct
    //     //         await asset.downloadAsync(); // Ensure the asset is downloaded
                
    //     //         // Get the file path
    //     //         const filePath = asset.localUri;

    //     //         // Read the file content using FileSystem
    //     //         const csvData = await FileSystem.readAsStringAsync(filePath);
                
    //     //         // Manually parse the CSV data
    //     //         const parsedData = parseCSV(csvData);
    //     //         setData(parsedData); // Set parsed data to state
    //     //     } catch (error) {
    //     //         console.error('Error reading CSV file:', error);
    //     //     }
    //     // };

    //     (async () => {
    //         const dir = FileSystem.documentDirectory; // Example: Use the document directory
    //         const csvFiles = await findCSVFiles('./Ice-Breaker-main/assets');
    //         console.log('CSV Files:', csvFiles);
    //     })();
    // }, []);

    // Function to manually parse the CSV string
    const parseCSV = (csvString) => {
        const rows = csvString.trim().split('\n');
        const headers = rows[0].split(',').map(header => header.trim());

        const data = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim());
            let rowObject = {};
            values.forEach((value, index) => {
                rowObject[headers[index]] = value;
            });
            return rowObject;
        });

        return data;
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Valve Trends</Text>

            {/* Render Data in a Table Format */}
            <View style={styles.table}>
                <View style={styles.row}>
                    {data[0] && Object.keys(data[0]).map((key) => (
                        <Text key={key} style={styles.cellHeader}>{key}</Text>
                    ))}
                </View>

                {data.map((row, index) => (
                    <View key={index} style={styles.row}>
                        {Object.values(row).map((value, i) => (
                            <Text key={i} style={styles.cell}>{value}</Text>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#293741',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cellHeader: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#3B576A',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: '#000',
    },
});

export default ValveTrends;

