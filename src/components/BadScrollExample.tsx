import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function BadScrollExample() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts') // simula una respuesta larga
      .then((res) => res.json())
      .then((data) => {
        // Simulamos tener 3000 elementos duplicando el resultado
        const hugeList = Array(30).fill(data).flat();
        setItems(hugeList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching items:', err);
        setError('Error loading items');
        setLoading(false);
      });
    // Simula una API que devuelve 1000+ elementos
  }, []);

  // Loading es mala practica de UX
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} testID='loading-indicator'>
        <View>
          <Text>Loading items...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} testID='error-indicator'>
        <Text>Error loading items</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {/** Nunca utilizes o renderices directamente sin una Lista */}
      {items.map((item, index) => (
        <View key={`post-item-${item.key}-${index}`/** Key */} style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
          <Text>{item.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
