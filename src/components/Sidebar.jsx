import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { initializeIptvApi } from '../API/IPTV_API';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function Sidebar({ navigation }) {
  const [iptvApi, setIptvApi] = useState(null);
  const [categories, setCategories] = useState({});
  const route = useRoute();
  const category_id = route.params?.categoryId;

  useEffect(() => {
    async function fetchIptvApi() {
      const api = await initializeIptvApi();
      setIptvApi(api);
    }

    fetchIptvApi();
  }, []);

  useEffect(() => {
    console.log("Sidebar line 23")
    if (iptvApi) {
      console.log(route.name)
      //get link -> check if is in /tv or /movies or /series
      if (route.name === 'TV') {
        iptvApi.getLiveStreamCategories().then((data) => {
          setCategories(data);
          console.log(data);
        });
      } else if (route.name.includes('Movies')) {
        console.log("a")
        iptvApi.getVODStreamCategories().then((data) => {
          setCategories(data);
          console.log(data);
        });
      } else { console.log("no categories")}
  }
  }, [route.name, iptvApi]);

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarContent}>
        <TouchableOpacity
          style={[styles.button, !category_id && styles.selected]}
          onPress={() => navigation.navigate('Movies')}
        >
          <Text>TODOS</Text>
        </TouchableOpacity>
        {Object.keys(categories).map((i) => {
          return (
            <TouchableOpacity
              key={categories[i].category_id}
              style={[styles.button, category_id === categories[i].category_id && styles.selected]}
              onPress={() => navigation.navigate('Movies', { categoryId: categories[i].category_id })}
            >
              <Text>{categories[i].category_name.replace('[ES]', '')}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
  },
  sidebarContent: {
    flex: 1,
  },
  button: {
    height: 'auto',
    minHeight: 50,
    width: '100%',
  },
  selected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default Sidebar;