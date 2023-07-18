import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { initializeIptvApi } from '../API/IPTV_API';
import { max } from 'react-native-reanimated';

function SingleMovie() {
    const [loading, setLoading] = useState(true);
    const [iptvApi, setIptvApi] = useState(null);
    const [movie, setMovie] = useState({});
    const navigation = useNavigation();
    const route = useRoute();
    const { id, title } = route.params;

    useEffect(() => {
        async function fetchIptvApi() {
            const api = await initializeIptvApi();
            setIptvApi(api);
        }

        fetchIptvApi();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [movie]);

    useEffect(() => {
        if (iptvApi && id && title) {
            iptvApi.getVODInfo(id).then((data) => {
                //translate genre, plot, title to spanish and set it to state
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${data.info.plot}`).then((response) => response.json()).then((aux) => data.info.plot = aux[0][0][0]);
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${data.info.genre}`).then((response) => response.json()).then((aux) => data.info.genre = aux[0][0][0]);
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${title}`).then((response) => response.json()).then((aux) => data.info.title = aux[0][0][0]);
                setMovie(data);
            });
        }
    }, [iptvApi, id]);

    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView contentContainerStyle={styles.main}>
                    <View style={styles.container}>
                        {movie && movie.info.movie_image && (
                            <Image
                                source={{ uri: movie.info.movie_image }}
                                style={styles.image}
                            />
                        )}

                        <View style={styles.desc}>
                            <Text style={styles.title}>{movie.info.title}</Text>
                            <Text style={styles.genre}>•&nbsp;
                                {movie.info.genre.split(',').map((genre, index) => {
                                    return <Text key={index}>{genre} •</Text>;
                                })}
                            </Text>
                            <Text style={styles.plot}>{movie.info.plot}</Text>

                            <View style={styles.otherInfo}>
                                <Text style={{ color: '#FFB101' }}>
                                    {movie.info.duration
                                        .split(':')
                                        .map((time, index) => {
                                            if (index === 0) {
                                                time = time.replace(/^0+/, '');
                                                return time + 'h y ';
                                            } else if (index === 1) {
                                                return time + 'm';
                                            }
                                        })}
                                </Text>
                                <Text style={{color: '#FFB101'}}>
                                    {Math.round(movie.info.rating * 10) / 10}/10
                                </Text>
                                <Text style={{color: '#FFB101'}}>
                                    {movie.info.releasedate
                                        .split('-')
                                        .reverse()
                                        .join('/')}
                                </Text>
                            </View>

                            <View style={styles.buttons}>
                                <TouchableOpacity>
                                    <Text style={styles.button_watch}>Ver película</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.button_trailer}>Ver tráiler (En pruebas)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Text style={styles.button_back}>Volver atrás</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );

}


const styles = StyleSheet.create({
    main: {
        color: '#fff',
        display: 'flex',
        padding: 50,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(18,22,53)',
    },
    container: {
        gap: 70,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        color: '#fff',
    },
    image: {
        width: 400,
        height: 600,
        resizeMode: 'contain',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FFB101',
        borderRadius: 10,
    },
    desc: {
        width: 'auto',
        height: 600,
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        marginBottom: 30,
        textTransform: 'uppercase',
        color: '#FFB101',
        maxWidth: 550,
    },
    genre: {
        marginBottom: 20,
        color: '#FFB101',
        fontSize: 20,
    },
    plot: {
        marginBottom: 20,
        fontSize: 20,
        color: '#fff',
        justifyContent: 'justify',
        maxWidth: 750,
    },
    otherInfo: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        color: '#fff',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 50,
        gap: 20,
        color: '#fff',
    },
    //child buttons styles
    button_watch: {
        backgroundColor: '#FFB101',
        padding: 10,
        borderRadius: 10,
        color: '#000',
    },
    button_trailer: {
        padding: 10,
        borderRadius: 10,
        borderColor: '#FFB101',
        borderWidth: 2,
        color: '#fff',
    },
    button_back: {
        padding: 10,
        borderRadius: 10,
        borderColor: '#FFB101',
        borderWidth: 2,
        color: '#fff',
    },

    //hovers
    button_watch_hover: {
        backgroundColor: '#FFB101',
        padding: 10,
        borderRadius: 10,
        color: '#000',
    },
    button_trailer_hover: {
        padding: 10,
        borderRadius: 10,
        borderColor: '#FFB101',
        borderWidth: 2,
        color: '#fff',
    },
    button_back_hover: {
        padding: 10,
        borderRadius: 10,
        borderColor: '#FFB101',
        borderWidth: 2,
        color: '#fff',
    },

});

export default SingleMovie;