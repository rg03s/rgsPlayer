import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { XTREAM_DNS_SERVER, XTREAM_PASSWD, XTREAM_USER } from '@env';
import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";
import ReactHlsPlayer from 'react-hls-player';

import "plyr-react/plyr.css"


function Player() {

    const route = useRoute();
    const stream_id = route.params?.id || '';
    const type = route.params?.type;

    console.log(stream_id, type);

    const username = XTREAM_USER;
    const password = XTREAM_PASSWD;
    const serverUrl = XTREAM_DNS_SERVER;

    let streamUrl = '';

    if (type == 'channel') {
        streamUrl = `${serverUrl}/live/${username}/${password}/${stream_id}.m3u8`;
    }
    else if (type == 'vod') {
        streamUrl = `${serverUrl}/movie/${username}/${password}/${stream_id}.m3u8`;
    }

    return (
        <View style={styles.container}>
            {!streamUrl ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ReactHlsPlayer
                    src={streamUrl}
                    autoPlay={true}
                    controls={true}
                    width="100%"
                    height="80%"
                />
            )}
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
});

export default Player;
