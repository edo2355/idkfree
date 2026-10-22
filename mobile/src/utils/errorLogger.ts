import { useState, useEffect } from 'react';

// Array global para guardar los logs
let globalLogs: string[] = [];
let listeners: ((logs: string[]) => void)[] = [];

export const ErrorLogger = {
  log: (msg: string) => {
    const time = new Date().toLocaleTimeString();
    globalLogs = [`[${time}] ${msg}`, ...globalLogs].slice(0, 50); // Guardar últimos 50
    listeners.forEach(l => l([...globalLogs]));
    console.log(msg); // También lo mandamos a la consola nativa
  },
  clear: () => {
    globalLogs = [];
    listeners.forEach(l => l([]));
  },
  subscribe: (listener: (logs: string[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};

// Interceptar errores globales de JS
const originalConsoleError = console.error;
console.error = (...args) => {
  ErrorLogger.log('ERROR: ' + args.join(' '));
  originalConsoleError(...args);
};

export const logConnectionEvent = (event: string, details?: any) => {
  ErrorLogger.log(`[LIVEKIT EVENT] ${event} ${details ? JSON.stringify(details) : ''}`);
};
