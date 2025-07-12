import ChatResponse from "@/src/components/ChatResponse";
import { askGemini } from "@/src/utils/api/gemini";
import { useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, `👤 ${input}`]);
    const reply = await askGemini(input);
    console.log("Respuesta de Gemini:", reply);
    setMessages((prev) => [...prev, `🤖 ${reply}`]);
    setInput("");
  };

  return (
    <View style={styles.container} >
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Escribe tu mensaje..."
        style={styles.input}
      />
      <Button title="Enviar" onPress={handleSend} />
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatResponse response={item} />}
        keyExtractor={(_, index) => `chat-message-${index}`}
      />
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingBottom: 40, marginTop: 18},
 
  message: { marginVertical: 4, color: '#fff' },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});
