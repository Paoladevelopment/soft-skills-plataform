import { AudioEffects } from '../types/game-sessions/gameSession.models'

/**
 * Converts frontend camelCase audio effects to backend snake_case format
 */
export const convertAudioEffectsToSnakeCase = (audioEffects: AudioEffects) => {
  return {
    reverb: audioEffects.reverb || 0,
    echo: audioEffects.echo || 0,
    background_noise: audioEffects.backgroundNoise || 0,
    speed_variation: audioEffects.speedVariation || 0,
  }
}
