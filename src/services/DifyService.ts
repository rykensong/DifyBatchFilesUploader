import FormData from 'form-data';
import fs from 'fs';
import { BaseUploadService } from './BaseUploadService';
import { AppConfig } from '../types';
import path from 'path';

export class DifyService extends BaseUploadService {
  constructor(private readonly serviceConfig: AppConfig['dify']) {
    super();
  }

  protected getUploadUrl(): string {
    return `${this.serviceConfig.apiUrl}/v1/datasets/${this.serviceConfig.datasetId}/document/create-by-file`;
  }

  protected getHeaders(formData: FormData): Record<string, string> {
    return {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${this.serviceConfig.apiKey}`
    };
  }

  protected formatUploadData(filePath: string): FormData {
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
    
    return formData;
  }

  public isSupportedFile(filename: string): boolean {
    const extension = path.extname(filename).toLowerCase();
    return this.serviceConfig.supportedExtensions.includes(extension);
  }
}
