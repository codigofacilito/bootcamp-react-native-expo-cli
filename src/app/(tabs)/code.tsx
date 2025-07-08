import React, { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';

// import { hasVibrator } from 'expo-vibration';
 
const PAGE_SIZE = 10;

export default function BadScrollExample() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${PAGE_SIZE}&_page=${pageNumber}`
      );
      const newData = await response.json();

      if (newData.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setData((prev) => [...prev, ...newData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Solo se ejecuta durante la primera carga
  useEffect(() => {
    fetchData(page);
  }, []);

  // No utilices useEffect si es un evento directo
  /* useEffect(() => {
    fetchData(page);
  }, [page]); */

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchData(page + 1);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderItem = useCallback(({ item }) => (
    <View style={{
        marginVertical: 8,
    }}>
        <Text>Titulo: {item.title}</Text>
        <Text>Body: {item.body}</Text>
    </View>
  ), [])

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `post-item-${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <Button title="Test vibration" onPress={() => {
       // hasVibrator();
      }}  />
    </>

  );
}
