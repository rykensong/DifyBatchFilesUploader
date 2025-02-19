import { ApiService } from './services/ApiService';
import { AppConfig } from './utils/configUtils';
import config from '../config.json';

const appConfig: AppConfig = {
  ...config
};
const apiService = new ApiService(appConfig);

import { walkDirectory } from './utils/fileUtils';

import path from 'path';

const isSupportedFile = (filename: string) => {
  const supportedExtensions = config.dify.supportedExtensions;
  return supportedExtensions.includes(path.extname(filename).toLowerCase());
};

export async function uploadFiles() {
  let processedCount = 0;
  for await (const filePath of walkDirectory(appConfig.folderPath, isSupportedFile)) {
    await apiService.sendToDify(filePath);
    processedCount++;
  }
  console.log(`🎉 All files processed, total: ${processedCount} files`);
}

uploadFiles().catch((error) => {
  console.error('Error sending to Dify:', error);
});