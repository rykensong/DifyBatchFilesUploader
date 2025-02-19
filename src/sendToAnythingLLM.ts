import { ApiService } from './services/ApiService';
import { AppConfig, loadConfiguration } from './utils/configUtils';
import FormData from 'form-data';
import fs from 'fs';
import { walkDirectory } from './utils/fileUtils';
import path from 'path';

export async function main() {
  const config: AppConfig = await loadConfiguration('config.json');
  const apiService = new ApiService(config);

  const supportedExtensions = new Set(
    Object.values(config.anythingLLM.fileTypes)
      .flat()
      .map((ext: string) => ext.toLowerCase())
  );

  function isSupportedFile(filename: string): boolean {
    const extension = path.extname(filename).toLowerCase();
    return supportedExtensions.has(extension);
  }

  for await (const filePath of walkDirectory(config.folderPath, isSupportedFile)) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
      await apiService.sendToAnythingLLM(formData, filePath);
      console.log(`Successfully uploaded: ${filePath}`);
    } catch (error) {
      console.error(`Error sending to AnythingLLM: ${filePath}`, error);
    }
  }
}

main().catch((error) => {
  console.error('Error in main execution:', error);
});