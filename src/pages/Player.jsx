import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
import { XTREAM_DNS_SERVER, XTREAM_PASSWD, XTREAM_USER } from '@env';

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

    return (
        <View style={styles.container}>
            {!streamUrl ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : Platform.OS === 'web' ? (
                <VlCPlayerView
                    autoplay={false}
                    url="https://www.radiantmediaplayer.com/media/big-buck-bunny-360p.mp4"
                    Orientation={Orientation}
                    ggUrl=""
                    showGG={true}
                    showTitle={true}
                    title="Big Buck Bunny"
                    showBack={true}
                    onLeftPress={() => { }}
                />
            ) : (
                <View>
                    <Video source={{ uri: streamUrl }} style={{ width: 300, height: 200 }} />
                </View>
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
