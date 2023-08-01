import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { initializeIptvApi } from '../API/IPTV_API';
import { Player } from 'video-react';
import '../../node_modules/video-react/styles/scss/video-react.scss'
function PlayerPage() {
    const [iptvApi, setIptvApi] = useState(null);
    const [mediaContent, setMediaContent] = useState();

    const navigation = useNavigation();
    const route = useRoute();
    const stream_id = route.params?.id;

    useEffect(() => {
        async function fetchIptvApi() {
            const api = await initializeIptvApi();
            setIptvApi(api);
        }

        fetchIptvApi();
    }, []);

    useEffect(() => {
        if (iptvApi) {
            iptvApi.getVODInfo(stream_id).then((data) => {
                console.log(data.movie_data.direct_source)
                setMediaContent(data.movie_data.direct_source);
                console.log(mediaContent);
            });
        }
    }, [navigation, iptvApi]);

    return (
        <View style={styles.container}>
            {!mediaContent ? (
                <ActivityIndicator size="large" color="#0000ff" style={{height: "100%"}}/>
            ) : (
                <Player>
                    <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
                </Player>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default PlayerPage;
