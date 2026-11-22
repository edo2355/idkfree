declare module 'expo-sqlite' {
  export function openDatabaseSync(name: string): any;
  export function openDatabaseAsync(name: string): any;
  export type SQLiteDatabase = any;
}
