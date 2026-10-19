import * as VideoThumbnails from 'expo-video-thumbnails';

/**
 * Genera una miniatura (thumbnail) a partir de la URL de un video.
 */
export async function getVideoThumbnail(videoUrl: string): Promise<string | null> {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time: 1000, // Captura el segundo 1 del video
      quality: 0.7,
    });
    return uri;
  } catch (e) {
    console.warn('No se pudo generar la miniatura para:', videoUrl);
    return null;
  }
}
