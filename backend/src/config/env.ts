import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno: ${name}`);
  return v;
}

export const env = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwtSecret: required('JWT_SECRET'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',
  opensanctionsApiKey: process.env.OPENSANCTIONS_API_KEY ?? '',
  sanctionsBlockThreshold: parseFloat(process.env.SANCTIONS_THRESHOLD_BLOCK ?? '0.85'),
  sanctionsReviewThreshold: parseFloat(process.env.SANCTIONS_THRESHOLD_REVIEW ?? '0.70'),
  cardSecret: required('CARD_SECRET'),
};
