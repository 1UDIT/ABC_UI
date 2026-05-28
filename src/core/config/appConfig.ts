export type AppConfig = {
  apiBaseUrl: string;
};

let appConfig: AppConfig | undefined;

export async function loadAppConfig(): Promise<AppConfig> {
  if (appConfig !== undefined) {
    return appConfig;
  }

  const response = await fetch(`${import.meta.env.BASE_URL}config/app-config.json`,
    {
      headers: {
        "Cache-Control": "no-cache"
      }
    });

  if (!response.ok) {
    throw new Error("Failed to load app config");
  }

  const config = (await response.json()) as AppConfig;

  appConfig = config;

  return config;
}

export function getAppConfig(): AppConfig {
  if (appConfig === undefined) {
    throw new Error("App config not loaded. Call loadAppConfig() first.");
  }

  return appConfig;
}