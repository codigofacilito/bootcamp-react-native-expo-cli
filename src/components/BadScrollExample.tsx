import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function BadScrollExample() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula una API que devuelve 1000+ elementos
    fetch('https://jsonplaceholder.typicode.com/posts') // simula una respuesta larga
      .then((res) => res.json())
      .then((data) => {
        // Simulamos tener 3000 elementos duplicando el resultado
        const hugeList = Array(30).fill(data).flat();
        setItems(hugeList);
        setLoading(false);
      });
      // No deberiamos de tener una llamada a la API con muchos elementos
      // 10 elementos
      // # 1 Paginacion 
  }, []);

  // Loading es mala practica de UX
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
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
