import { z } from 'zod';

export const pinSchema = z.string().regex(/^\d{4,8}$/, 'El PIN debe tener entre 4 y 8 dígitos');

export const registerSchema = z.object({
  email: z.string().email('Email inválido').max(255),
  alias: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Solo minúsculas, números y _'),
  password: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/),
  name: z.string().min(1).max(100).optional(),
  // PINs del carnet (opcionales, se generan si no vienen)
  pins: z.object({
    panic: pinSchema.optional(),
    recovery: pinSchema.optional(),
    destroy: pinSchema.optional(),
  }).optional(),
  // 3 PINs secretos (obligatorios, 4-8 dígitos, únicos entre sí)
  secretPins: z
    .array(pinSchema)
    .length(3, 'Debes enviar exactamente 3 PINs secretos')
    .refine((arr) => new Set(arr).size === 3, 'Los 3 PINs secretos deben ser diferentes'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
