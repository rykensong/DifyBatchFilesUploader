import { loadConfiguration } from './utils/configUtils';
import { walkDirectory } from './utils/fileUtils';
import { DifyService } from './services/DifyService';
import { AnythingLLMService } from './services/AnythingLLMService';
import { AppConfig } from './types';

async function main() {
  try {
    const config: AppConfig = await loadConfiguration('config.json');
    const difyService = new DifyService(config.dify);
    const anythingLLMService = new AnythingLLMService(config.anythingLLM);

    let processedCount = 0;
    let successCount = 0;
    let failureCount = 0;

    console.log('Starting file processing...');

    // Process files for Dify if enabled
    if (config.dify.enabled) {
      console.log('Processing files for Dify...');
      for await (const filePath of walkDirectory(config.folderPath, file => difyService.isSupportedFile(file))) {
        const result = await difyService.uploadFile(filePath);
        processedCount++;

        if (result.success) {
          console.log(`✅ Dify upload successful: ${filePath} (Status: ${result.statusCode})`);
          successCount++;
        } else {
          console.error(`❌ Dify upload failed: ${filePath}`, result.error);
          failureCount++;
        }
      }
    } else {
      console.log('Dify service is disabled, skipping...');
    }

    // Process files for AnythingLLM if enabled
    if (config.anythingLLM.enabled) {
      console.log('Processing files for AnythingLLM...');
      for await (const filePath of walkDirectory(config.folderPath, file => anythingLLMService.isSupportedFile(file))) {
        const result = await anythingLLMService.uploadFile(filePath);
        processedCount++;

        if (result.success) {
          console.log(`✅ AnythingLLM upload successful: ${filePath} (Status: ${result.statusCode})`);
          successCount++;
        } else {
          console.error(`❌ AnythingLLM upload failed: ${filePath}`, result.error);
          failureCount++;
        }
      }
    } else {
      console.log('AnythingLLM service is disabled, skipping...');
    }

    console.log('\nProcessing Summary:');
    console.log(`Total files processed: ${processedCount}`);
    console.log(`Successful uploads: ${successCount}`);
    console.log(`Failed uploads: ${failureCount}`);

  } catch (error) {
    console.error('Application error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
