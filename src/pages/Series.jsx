import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, ScrollView } from 'react-native';
import Poster from '../components/Poster';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { initializeIptvApi } from '../API/IPTV_API';

function Series() {
  const [iptvApi, setIptvApi] = useState(null);
  const [series, setseries] = useState([]);
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
      iptvApi.getVODStreams().then((data) => {
        setseries(data);
      });
    }
  }, [navigation, iptvApi]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      {!series.length ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : category_id ? (
        series
          .filter((serie) => serie.category_id === category_id)
          .map((serie) => {
            return serie.name != null ? (
              <Poster
                key={serie.stream_id}
                title={serie.name.replace('[ES]', '')}
                image={serie.stream_icon}
                rating={serie.rating}
                id={serie.stream_id}
              />
            ) : (
              <View></View>
            );
          })
      ) : (
        series.map((serie) => {
          return serie.name != null ? (
            <Poster
              key={serie.stream_id}
              title={serie.name.replace('[ES]', '')}
              image={serie.stream_icon}
              rating={serie.rating}
              id={serie.stream_id}
            />
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


export default Series;