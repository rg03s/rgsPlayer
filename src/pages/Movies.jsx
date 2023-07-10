import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, ScrollView } from 'react-native';
import Poster from '../components/Poster';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { initializeIptvApi } from '../API/IPTV_API';

function Movies() {
  const [iptvApi, setIptvApi] = useState(null);
  const [movies, setMovies] = useState([]);
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
        setMovies(data);
      });
    }
  }, [navigation, iptvApi]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      {!movies.length ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : category_id ? (
        movies
          .filter((movie) => movie.category_id === category_id)
          .map((movie) => {
            return movie.name != null ? (
              <Poster
                key={movie.stream_id}
                title={movie.name.replace('[ES]', '')}
                image={movie.stream_icon}
                rating={movie.rating}
                id={movie.stream_id}
              />
            ) : (
              <View></View>
            );
          })
      ) : (
        movies.map((movie) => {
          return movie.name != null ? (
            <Poster
              key={movie.stream_id}
              title={movie.name.replace('[ES]', '')}
              image={movie.stream_icon}
              rating={movie.rating}
              id={movie.stream_id}
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


export default Movies;