import { z } from 'zod';

export const pinSchema = z.string().regex(/^\d{4,8}$/, 'El PIN debe tener entre 4 y 8 dígitos');

export const registerSchema = z.object({
  email: z.string().email('Email inválido').max(255).optional(),
  phone_number: z.string().optional(),
  alias: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Solo minúsculas, números y _'),
  password: z.string().min(8).max(128).regex(/[a-zA-Z]/).regex(/\d/),
  name: z.string().max(100).optional().nullable(),
  pins: z.object({
    panic: pinSchema.optional(),
    recovery: pinSchema.optional(),
    destroy: pinSchema.optional(),
  }).optional(),
  // 3 PINs secretos (4-8 dígitos, no es obligatorio que sean únicos)
  secretPins: z.array(pinSchema).length(3, 'Debes enviar exactamente 3 PINs secretos'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
