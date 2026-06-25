export interface AppConfig {
  port: number;
  apiToken: string;
  databaseUrl: string;
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT) || 3000,
    apiToken: process.env.API_TOKEN ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
  };
}

export const config = loadConfig();
