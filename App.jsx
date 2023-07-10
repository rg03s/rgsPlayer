import React, { useEffect, useState, useMemo } from 'react';
import 'react-native-gesture-handler';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeIptvApi } from './src/API/IPTV_API';
import SingleMovie from './src/pages/SingleMovie';
import Movies from './src/pages/Movies';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MoviesStack() {
  const route = useRoute();
  const category_id = route.params?.category_id;
  
  return (
    <Stack.Navigator initialRouteName='Movies'>
      <Stack.Screen name="Movies" component={Movies} options={{ headerShown: false }} initialParams={{ category_id: category_id }} />
      <Stack.Screen name="SingleMovie" component={SingleMovie} options={{ headerShown: false }} />
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
  const { width, height } = Dimensions.get('window');

  const containerStyle = useMemo(
    () =>
      StyleSheet.create({
        flex: 1,
        marginTop: Constants.statusBarHeight,
        height: height,
        width: width,
      }),
    [height, width]
  );

  useEffect(() => {
    async function fetchAndTranslateCategories() {
      const api = await initializeIptvApi();
      const data = await api.getVODStreamCategories();

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

    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      // Update state or make other changes based on the new dimensions
    };

    Dimensions.addEventListener('change', updateDimensions);

    return () => {
      Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);

  return translatedCategories.length === 0 ? (
    <Text>Loading...</Text>
  ) : (
    <View style={containerStyle}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Movies" unmountInactiveScreens={true}>
          <Drawer.Screen
            key='all-movies'
            name="TODAS LAS PELÍCULAS"
            component={MoviesStack}
          />
          {translatedCategories.map((category) => (
            <Drawer.Screen
              key={category.category_id}
              name={category.translatedCategoryName}
              component={MoviesStack}
              initialParams={{ category_id: category.category_id }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default App;