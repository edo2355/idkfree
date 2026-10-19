import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base de diseño (iPhone 11 / pantalla estándar)
const BASE_WIDTH = 375;

// Calcula la escala basada en el ancho de la pantalla
export const scale = (size: number) => (width / BASE_WIDTH) * size;

// Detecta si la pantalla es pequeña (como un J2 o un iPhone SE)
export const isSmallDevice = height < 700;

// Limita el tamaño máximo para que no se vea gigante en tablets
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Exportar dimensiones actuales
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
