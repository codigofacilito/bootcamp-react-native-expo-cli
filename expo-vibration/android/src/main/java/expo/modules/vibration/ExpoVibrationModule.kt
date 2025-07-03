package expo.modules.vibration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import expo.modules.kotlin.Promise

class ExpoVibrationModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoVibration')` in JavaScript.
    Name("ExpoVibration")

    AsyncFunction("hasVibrator") { promise: Promise ->
      try {
        val vibrator = getVibrator()
        val hasVibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          vibrator.hasVibrator()
        } else {
          true
        }
        promise.resolve(hasVibrator)
      } catch (e: Exception) {
        promise.reject("VIBRATOR_CHECK_ERROR", "Error al verificar vibrador: ${e.message}", e)
      }
    }

    // Función adicional para vibrar
    AsyncFunction("vibrate") { duration: Long, promise: Promise ->
      try {
        val vibrator = getVibrator()
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          val vibrationEffect = VibrationEffect.createOneShot(
            duration,
            VibrationEffect.DEFAULT_AMPLITUDE
          )
          vibrator.vibrate(vibrationEffect)
        } else {
          @Suppress("DEPRECATION")
          vibrator.vibrate(duration)
        }
        
        promise.resolve(true)
      } catch (e: Exception) {
        promise.reject("VIBRATION_ERROR", "Error al vibrar: ${e.message}", e)
      }
    }
  }

  // La función getVibrator() debe estar FUERA del bloque ModuleDefinition
  private fun getVibrator(): Vibrator {
    val context = appContext.reactContext ?: throw IllegalStateException("React context no disponible")
    
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
      vibratorManager.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }
  }
}