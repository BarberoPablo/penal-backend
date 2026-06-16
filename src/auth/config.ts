import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const authConfig = {
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: optional('JWT_EXPIRES_IN', '30d'),
  steamApiKey: required('STEAM_API_KEY'),
  frontendUrl: optional('FRONTEND_URL', 'http://localhost:3000'),
  backendUrl: optional('BACKEND_URL', 'http://localhost:3001'),
};
