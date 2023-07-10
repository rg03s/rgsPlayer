import React, { useEffect, useState, useMemo } from 'react';
import 'react-native-gesture-handler';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { initializeIptvApi } from './src/API/IPTV_API';
import Movies from './src/pages/Movies';

const Drawer = createDrawerNavigator();

function App() {
  const [translatedCategories, setTranslatedCategories] = useState([]);
  const { width, height } = Dimensions.get('window');

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
        <Drawer.Navigator initialRouteName="Movies">
          <Drawer.Screen name="TODOS" component={Movies} />
          {translatedCategories.map((category) => (
            <Drawer.Screen
              key={category.category_id}
              name={category.translatedCategoryName}
              component={Movies}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default App;