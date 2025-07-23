import { Image } from 'expo-image';
import { Alert, Button, ScrollView, StatusBar, StyleSheet } from 'react-native';

import { HelloWave } from '@/src/components/HelloWave';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { supabase } from '@/src/utils/supabase';
import { decode } from "base64-arraybuffer";
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import { useEffect, useState } from 'react';

const defaultPickerPreferences: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.7,
  base64: true,
};

export default function HomeScreen() {
  const [permissionsGranted, setPermisionsGranted] = useState(false);
  const [imageSelected, setImageSelected] = useState<{
    uri?: string,
    base64?: string | null
  }>({});
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const locationPermission = await ExpoLocation.requestForegroundPermissionsAsync();

      if (cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted' && locationPermission.status === 'granted') {
        setPermisionsGranted(true);
      } else { 
        Alert.alert(
          'Permisos necesarios',
          'La app necesita permisos de cámara, galería y ubicación para funcionar correctamente'
        );
      }
    } catch (error) {
      console.error(`Error al solicitar permisos: ${error}`);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

    if (!permissionsGranted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Solicitando permisos...</ThemedText>
        <Button onPress={requestPermissions} title="Conceder Permisos" />
      </ThemedView>
    );
  }
  
  const handleOpenGalleryPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync(defaultPickerPreferences);

      if (!result.canceled) {
        setImageSelected({
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
        });
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen: ', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen. Por favor, intenta de nuevo.');
    }
  };

  const handleTakePhotoPress = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync(defaultPickerPreferences);

      if (!result.canceled) {
        setImageSelected({
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
        });      
      }
    } catch (error) {
      console.error(`Error al tomar la foto: ${error}`);
      Alert.alert('Error', 'No se pudo tomar la foto. Por favor, intenta de nuevo.');
    }
  };

  const handleUploadPhotoPress = async () => {
    if (!imageSelected.base64) {
      console.error('Error, imagen en base64 no disponible');
      return;
    }

    setUploading(true);

    try {
      const imageName = "imagenTest.jpg";
      const imageBuffer = decode(imageSelected.base64);

      const { data, error } = await supabase.storage.from("images").upload(imageName, imageBuffer);

      if (error) {
        console.error(error);
      }

      setUploading(false);
      setImageSelected({});
      console.log(data);
    } catch (error) {
      setUploading(false);
      setImageSelected({});
      console.error('Ha ocurrido un error al subir la imagen a supabase ', error);
    }
    // const currentLocation = await ExpoLocation.getCurrentPositionAsync({});
    // Alert.alert('Carga Realizada', 'Se ha subido la imagen en tus favoritos');
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Galery Uploader</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.buttonsContainer}>
        <ThemedView style={styles.uploadBtnContainer}>
          <Button title="Tomar foto" onPress={handleTakePhotoPress} disabled={uploading} />
        </ThemedView>
        <ThemedView style={styles.openGalleryBtnContainer}>
          <Button title="Abrir Galeria" onPress={handleOpenGalleryPress} disabled={uploading} />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.imageContainer}>
        {!!imageSelected?.uri ? (
          <>
            <Image source={{ uri: imageSelected.uri }} style={styles.imageSelected} />
            <Button 
              title={uploading ? "Subiendo..." : "Subir Foto"}
              onPress={handleUploadPhotoPress}
              disabled={uploading}
            />
          </>
        ): undefined}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 14
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  uploadBtnContainer: {

  },
  openGalleryBtnContainer: {
    marginLeft: 8
  },
  imageSelected: {
    width: '100%',
    height: 200
  },
  imageContainer: {
    marginTop: 14
  }
});
