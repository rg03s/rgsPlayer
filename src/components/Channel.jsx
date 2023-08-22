//channel component
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { initializeIptvApi } from '../API/IPTV_API';
import { GOOGLE_CUSTOM_SEARCH_API } from "@env"; //enviroment variable
import { ProgressBar } from 'react-native-paper';

//aplha version, in development
function getChannelLogo(channelName) {
    const cx = '';
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API}&q=${channelName}%20logo&searchType=image&num=1`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Line 17 (channel.jsx component) : ' + JSON.stringify(data));
            if (data.items && data.items.length > 0) {
                return data.items[0].link;
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error('Error al obtener el logo del canal:', error);
            return null;
        });
}

// use example, alpha version
/* const nombreCanal = 'Movistar La Liga';
getChannelLogo(nombreCanal)
    .then(logoUrl => {
        if (logoUrl) {
            console.log(`Logo del canal ${nombreCanal}: ${logoUrl}`);
        } else {
            console.log(`No se encontró el logo del canal ${nombreCanal}`);
        }
    }); */

function calculateProgress(epg) {
    const start = new Date(epg.start);
    const end = new Date(epg.end);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return current / total;
}

const Channel = ({ title, image, id }) => {
    const navigation = useNavigation();
    const [iptvApi, setIptvApi] = useState(null);
    const [channel, setChannel] = useState([]);
    const [imageError, setImageError] = useState(false);
    const [epg, setEpg] = useState(null);

    useEffect(() => {
        async function fetchIptvApi() {
            const api = await initializeIptvApi();
            setIptvApi(api);
        }

        fetchIptvApi();
    }, []);

    useEffect(() => {
        if (iptvApi) {
            iptvApi.getLiveStreams().then((data) => {
                setChannel(data);
                iptvApi.getEPGLivetreams(id, 1).then((data) => {
                    setEpg(data.epg_listings[0]);
                });
            });
        }
    }, [navigation, iptvApi]);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Player', { id: id, type: 'channel' });
            }}
        >
            <View style={styles.container}>
                {imageError ? (
                    <Image style={styles.image} source={require("../../assets/rgsPlayer.png")} />
                ) : (
                    <Image style={styles.image} source={{ uri: image }} onError={handleImageError} />
                )}
                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.rating}>
                        {epg ? (
                            <>
                                <Text style={styles.epg}>{decodeURIComponent(escape(atob(epg.title)))}</Text>
                                {/* calculate progress with epg.start and epg.end */}
                                <ProgressBar progress={calculateProgress(epg)} color={'#000'} style={styles.roundedProgressBar} />
                            </>
                        ) : (<View />)}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        width: 300,
        height: 100,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
        resizeMode: 'contain',
    },
    info: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: 200,

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    epg: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 5,
    },
    roundedProgressBar: {
        borderRadius: 5,
        width: 200,
        height: 5,
        marginTop: 5,
    },
});


export default Channel;