declare module 'qrcode' {
  export function toString(text: string, options?: any): Promise<string>;
  export function toDataURL(text: string, options?: any): Promise<string>;
  export function toCanvas(canvas: any, text: string, options?: any): Promise<void>;
  export function toFile(path: string, text: string, options?: any): Promise<void>;
  export function toFileStream(stream: any, text: string, options?: any): Promise<void>;
}
