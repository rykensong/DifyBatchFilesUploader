import fs from 'fs/promises';
import { AppConfig } from '../types';

export async function loadConfiguration(configPath: string): Promise<AppConfig> {
  try {
    const configFile = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configFile) as AppConfig;

    validateConfig(config);
    return config;
  } catch (error) {
    throw new Error(`Configuration load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function validateConfig(config: AppConfig): void {
  const requiredFields = {
    folderPath: 'string',
    dify: {
      datasetId: 'string',
      apiKey: 'string',
      apiUrl: 'string',
      supportedExtensions: 'array'
    },
    anythingLLM: {
      apiKey: 'string',
      apiUrl: 'string',
      fileTypes: 'object'
    }
  };

  validateFields('root', config, requiredFields);
}

function validateFields(prefix: string, obj: any, fields: Record<string, any>): void {
  for (const [key, value] of Object.entries(fields)) {
    if (!(key in obj)) {
      throw new Error(`Missing required field: ${prefix}.${key}`);
    }

    if (typeof value === 'string') {
      const actualType = Array.isArray(obj[key]) ? 'array' : typeof obj[key];
      if (actualType !== value && !(value === 'array' && Array.isArray(obj[key]))) {
        throw new Error(`Invalid type for ${prefix}.${key}: expected ${value}, got ${actualType}`);
      }
    } else if (typeof value === 'object') {
      validateFields(`${prefix}.${key}`, obj[key], value);
    }
  }
}
