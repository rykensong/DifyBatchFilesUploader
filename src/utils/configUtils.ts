import fs from 'fs/promises';

export interface AppConfig {
  folderPath: string;
  dify: {
    datasetId: string;
    apiKey: string;
    apiUrl: string;
  };
  anythingLLM: {
    apiKey: string;
    fileTypes: Record<string, string[]>;
    apiUrl: string;
  };
}

export async function loadConfiguration(configPath: string): Promise<AppConfig> {
  try {
    const configFile = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configFile) as AppConfig;
  } catch (error) {
    throw new Error(`Configuration load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}