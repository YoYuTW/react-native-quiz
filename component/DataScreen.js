import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { MainTitleUpdate } from '../navigator/Drawer';


export default function DataScreen({ navigation, route }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch("https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8");
      const json = await response.json();
      setData(json);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  });

  const handleTitle = useContext(MainTitleUpdate);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      handleTitle(route.name)
    });

    return unsubscribe
  }, [navigation, route]);

  return (
    <View style={styles.dataList}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index}
          renderItem={({item: data}) => <Text style={styles.item}>{data.name}, {data.city}</Text>}
        />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  dataList: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
})