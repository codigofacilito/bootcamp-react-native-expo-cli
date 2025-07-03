import { requireNativeModule } from 'expo-modules-core';
import { ExpoVibrationModule } from './ExpoVibration.types';

const ExpoVibration = requireNativeModule<ExpoVibrationModule>('ExpoVibration');

export async function hasVibrator(): Promise<boolean> {
  try {
    console.log(ExpoVibration, 'ExpoVibration');
    return await ExpoVibration.hasVibrator();
  } catch (error) {
    console.error('Error al verificar vibrador:', error);
    return false;
  }
}

export async function vibrate(time: number): Promise<boolean> {
  try {
    console.log(ExpoVibration, 'ExpoVibration');
    return await ExpoVibration.vibrate(time);
  } catch (error) {
    console.error('Error al verificar vibrador:', error);
    return false;
  }
}