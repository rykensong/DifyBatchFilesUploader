export interface AppConfig {
  folderPath: string;
  dify: {
    enabled: boolean;
    datasetId: string;
    apiKey: string;
    apiUrl: string;
    supportedExtensions: string[];
  };
  anythingLLM: {
    enabled: boolean;
    apiKey: string;
    fileTypes: Record<string, string[]>;
    apiUrl: string;
  };
}

export interface UploadResult {
  success: boolean;
  filePath: string;
  error?: string;
  statusCode?: number;
}

export interface FileProcessingConfig {
  maxRetries: number;
  delayBetweenRetries: number;
}
