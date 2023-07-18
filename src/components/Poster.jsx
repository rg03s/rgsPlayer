import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Poster({ image, title, rating, id }) {
  const [translatedTitle, setTranslatedTitle] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${title}`)
      .then((response) => response.json())
      .then((translated_title) => {
        if (translated_title && translated_title[0] && translated_title[0][0]) {
          setTranslatedTitle(translated_title[0][0][0]);
        } else {
          setTranslatedTitle('');
        }
      });
  }, [title]);

  if (!translatedTitle) {
    return <View></View>;
  }

  return (
    <View>
      {!image ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.poster}>
          <TouchableOpacity style={styles.container}
            onPress={() => navigation.navigate('SingleMovie', { id, title })}
          >
            <Text style={styles.rating}>{Math.round(rating * 10) / 10} &#x2605;</Text>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.posterTitle}>{translatedTitle}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    position: 'relative',
    width: 300,
    height: 450,
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    textTransform: 'capitalize',
    borderColor: 'rgb(255, 176, 1)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 0 10px',
    }
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  rating: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    borderWidth: 1,
    color: 'rgb(255, 176, 1)',
    borderColor: 'rgb(255, 176, 1)',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  posterTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Poster;