import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, ScrollView } from 'react-native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { initializeIptvApi } from '../API/IPTV_API';
import Channel from '../components/Channel';

function Channels() {
    const [iptvApi, setIptvApi] = useState(null);
    const [channels, setChannels] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const category_id = route.params?.category_id;
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
                setChannels(data);
                console.log(data);
            });
        }
    }, [navigation, iptvApi]);

    return (
        <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
            {!channels.length ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : category_id ? (
                channels
                    .filter((channel) => channel.category_id === category_id)
                    .map((channel) => {console.log(channel);
                        return channel.name != null ? (
                            <Channel title={channel.name} image={channel.stream_icon} id={channel.stream_id} key={channel.stream_id} />
                        ) : (
                            <View></View>
                        );
                    })
            ) : (
                channels.map((channel) => {
                    return channel.name != null ? (
                        <Channel title={channel.name} image={channel.stream_icon} id={channel.stream_id} key={channel.stream_id} />
                    ) : (
                        <View></View>
                    );
                })
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // Other container styles
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 20,
        gap: 20,
    },
});


export default Channels;