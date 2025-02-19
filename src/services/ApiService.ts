import axios, { AxiosError } from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { AppConfig } from '../utils/configUtils';

export class ApiService {
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  public async sendToAnythingLLM(formData: FormData, filename: string): Promise<void> {
    try {
      const url = `${this.config.anythingLLM.apiUrl}/api/v1/document/upload`;
      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.config.anythingLLM.apiKey}`
        }
      });

      console.log(`✅ Upload successful: ${filename} (Status: ${response.status})`);
    } catch (error) {
      const errorInfo = this.formatError(error, filename);
      console.error(`❌ Upload failed: ${filename}`, errorInfo);
    }
  }

  public async sendToDify(filePath: string): Promise<void> {
    const datasetId = this.config.dify.datasetId;
    const apiKey = this.config.dify.apiKey;
    const url = `${this.config.dify.apiUrl}/v1/datasets/${datasetId}/document/create-by-file`;
    const formData = new FormData();
    formData.append('data', JSON.stringify({
      indexing_technique: 'high_quality',
      process_rule: {
        rules: {
          pre_processing_rules: [
            { id: 'remove_extra_spaces', enabled: true },
            { id: 'remove_urls_emails', enabled: true }
          ],
          segmentation: {
            separator: '###',
            max_tokens: 5000
          }
        },
        mode: 'automatic'
      }
    }), { contentType: 'text/plain' });
    formData.append('file', fs.createReadStream(filePath));

    try {
      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${apiKey}`
        }
      });

      console.log(`✅ Document creation successful (Status: ${response.status}, File: ${filePath})`);
    } catch (error) {
      console.error(`❌ Document creation failed`, this.formatError(error, filePath));
    }
  }

  private formatError(error: unknown, filename: string): string {
    if (error instanceof AxiosError) {
      return `API Error: ${error.response?.data || error.message}`;
    }

    return error instanceof Error
      ? error.message
      : 'Unknown error type';
  }
}