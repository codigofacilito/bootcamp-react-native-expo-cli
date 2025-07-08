import axios from "axios";

const GEMINI_API_KEY = 'AIzaSyC92oxzk6eltXNANvfB6ndhwugEZEmyFCA'; //process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function askGemini(prompt: string) {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await axios.post(
    GEMINI_URL,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
    }
  ).catch((error) => {
    console.error("Error al llamar a Gemini:", error)
  });

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sin respuesta.";
}
