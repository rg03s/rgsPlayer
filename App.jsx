import React, { useEffect, useState, useMemo } from 'react';
import 'react-native-gesture-handler';
import { View, Text, useWindowDimensions, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeIptvApi } from './src/API/IPTV_API';
import SingleMovie from './src/pages/SingleMovie';
import Movies from './src/pages/Movies';
import Series from './src/pages/Series';
import Trailer from './src/pages/Trailer';
import Player from './src/pages/Player';
import Channels from './src/pages/Channels';
import { set } from 'react-native-reanimated';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const config = {
  defaultPage: 0, // 0: Channels, 1: Movies, 2: Series
};


const CustomDrawerButtons = ({ navigation, setCurrentPage }) => (
  <View style={{ flexDirection: 'row', paddingRight: 30, gap: 10 }}>
    <TouchableOpacity
      style={styles.rightMenuButton}
      onPress={() => {
        setCurrentPage(0);
      }}
    >
      <Text>Canales de TV</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.rightMenuButton}
      onPress={() => {
        setCurrentPage(1);
      }}
    >
      <Text>Películas</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        setCurrentPage(2);
      }}
      style={styles.rightMenuButton}
    >
      <Text>Series</Text>
    </TouchableOpacity>
  </View>
);

function MoviesStack() {
  const route = useRoute();
  const category_id = route.params?.category_id;

  return (
    <Stack.Navigator>
      <Stack.Screen name="Movies" component={Movies} options={{ headerShown: false }} initialParams={{ category_id: category_id }} />
      <Stack.Screen name="SingleMovie" component={SingleMovie} options={{ headerShown: false }} />
      <Stack.Screen name="Trailer" component={Trailer} options={{ headerShown: false }} />
      <Stack.Screen name="Player" component={Player} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function SeriesStack() {
  const route = useRoute();
  const category_id = route.params?.category_id;

  return (
    <Stack.Navigator>
      <Stack.Screen name="Series" component={Series} options={{ headerShown: false }} initialParams={{ category_id: category_id }} />
      <Stack.Screen name="SingleMovie" component={SingleMovie} options={{ headerShown: false }} />
      <Stack.Screen name="Trailer" component={Trailer} options={{ headerShown: false }} />
      <Stack.Screen name="Player" component={Player} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ChannelsStack() {
  const route = useRoute();
  const category_id = route.params?.category_id;

  return (
    <Stack.Navigator>
      <Stack.Screen name="Channels" component={Channels} options={{ headerShown: false }} initialParams={{ category_id: category_id }} />
      <Stack.Screen name="Player" component={Player} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

async function translateText(text) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${text}`
  );
  const translatedData = await response.json();

  if (translatedData && translatedData[0] && translatedData[0][0]) {
    return translatedData[0][0][0];
  } else {
    return '';
  }
}

function App() {
  const [translatedCategories, setTranslatedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(config.defaultPage);

  useEffect(() => {
    async function fetchAndTranslateCategories() {
      const api = await initializeIptvApi();
      const data = currentPage === 0 ? await api.getLiveStreamCategory() : currentPage === 1 ? await api.getVODStreamCategories() : await api.getVODStreamCategories();
      const translatedCategoriesPromises = data.map(async (category) => {
        const translatedCategoryName = await translateText(
          category.category_name.replace('[ES]', '')
        );
        return { ...category, translatedCategoryName };
      });

      const translatedCategoriesData = await Promise.all(
        translatedCategoriesPromises
      );
      setTranslatedCategories(translatedCategoriesData);
    }

    fetchAndTranslateCategories();

  }, [currentPage]);

  return translatedCategories.length === 0 ? (
    <ActivityIndicator size="large" color="#0000ff" style={{ width: "100%" }} />
  ) : (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={
          currentPage === 0
            ? "Channels"
            : currentPage === 1
              ? "Movies"
              : "Series"
        }
        unmountInactiveScreens={true}
      >
        <Drawer.Screen
          key={currentPage === 0 ? "all-channels" : currentPage === 1 ? "all-movies" : "all-series"}
          name={currentPage === 0 ? "Todos los canales" : currentPage === 1 ? "Todas las películas" : "Todas las series"}
          component={currentPage === 0
            ? ChannelsStack
            : currentPage === 1
              ? MoviesStack
              : SeriesStack}
          options={({ navigation }) => ({
            headerRight: () => <CustomDrawerButtons navigation={navigation} setCurrentPage={setCurrentPage} />,
          })}
        />
        {translatedCategories.map((category) => (
          <Drawer.Screen
            key={category.category_id}
            name={category.translatedCategoryName}
            component={
              currentPage === 0
                ? ChannelsStack
                : currentPage === 1
                  ? MoviesStack
                  : SeriesStack
            }
            initialParams={{ category_id: category.category_id }}
            options={({ navigation }) => ({
              headerRight: () => <CustomDrawerButtons navigation={navigation} setCurrentPage={setCurrentPage} />,
            })}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' || Platform.OS === 'android' ? 10 : Constants.statusBarHeight,
    backgroundColor: '#fff',
    height: Platform.isTV ? useWindowDimensions().height : '100%',
    width: Platform.isTV ? useWindowDimensions().width : '100%',
  },
  rightMenuButton: {
    border: '1px solid #000',
    borderRadius: 5,
    width: 120,
    padding: 10,
    alignItems: 'center',
  },
});

export default App;