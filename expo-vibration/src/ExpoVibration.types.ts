export interface ExpoVibrationModule {
  hasVibrator(): Promise<boolean>;
  vibrate(time: number): Promise<boolean>;
}