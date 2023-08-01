import { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import {YOUTUBE_API_KEY} from "@env";

const API_KEY = YOUTUBE_API_KEY;

function searchTrailer(title) {
    const category = "";
    const searchQuery = `trailer castellano pelicula ${title}`;
    console.log(searchQuery);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&order=viewCount&relevanceLanguage=es&key=${API_KEY}`;

    return fetch(url).then((response) => response.json()).then((data) => {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/embed/${videoId}`;
    });
}

function Trailer({ }) {
    const [trailerUrl, setTrailerUrl] = useState("");
    const [translated_title, setTranslatedTitle] = useState("");
    const route = useRoute();
    const navigation = useNavigation();
    const { id, title } = route.params;

    useEffect(() => {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${title}`)
            .then((response) => response.json())
            .then((res) => {
                if (res && res[0] && res[0][0]) {
                    setTranslatedTitle(res[0][0][0]);
                    searchTrailer(translated_title).then((url) => {
                        setTrailerUrl(url);
                    });
                } else {
                    setTranslatedTitle("");
                }
            });

    }, [id, title, translated_title]);

    return (
        <View style={{ display: "flex", alignContent: 'center', justifyContent: "center", alignItems: "center", flexDirection: 'column', height: '100%', width: '100%' }}>
            {trailerUrl ? (
                <View style={{ display: "flex", alignContent: 'center', justifyContent: "center", alignItems: "center", flexDirection: 'column', height: '100%', width: '100%' }}>
                    <iframe
                        width="80%"
                        height="80%"
                        src={trailerUrl}
                        title="Trailer"
                        allowFullScreen
                    ></iframe>
                    <TouchableOpacity style={styles.button_back} onPress={() => navigation.goBack()}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bolder' }}>Volver atrás</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    button_back: {
        padding: 10,
        height: 50,
        width: 190,
        borderRadius: 10,
        backgroundColor: '#FFB101',
        borderWidth: 2,
        color: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 15
    },

});

export default Trailer;