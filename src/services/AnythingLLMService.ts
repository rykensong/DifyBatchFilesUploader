import FormData from 'form-data';
import fs from 'fs';
import { BaseUploadService } from './BaseUploadService';
import { AppConfig } from '../types';
import path from 'path';

export class AnythingLLMService extends BaseUploadService {
  constructor(private readonly serviceConfig: AppConfig['anythingLLM']) {
    super();
  }

  protected getUploadUrl(): string {
    return `${this.serviceConfig.apiUrl}/api/v1/document/upload`;
  }

  protected getHeaders(formData: FormData): Record<string, string> {
    return {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${this.serviceConfig.apiKey}`
    };
  }

  protected formatUploadData(filePath: string): FormData {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    return formData;
  }

  public isSupportedFile(filename: string): boolean {
    const extension = path.extname(filename).toLowerCase();
    const supportedExtensions = new Set(
      Object.values(this.serviceConfig.fileTypes)
        .flat()
        .map(ext => ext.toLowerCase())
    );
    return supportedExtensions.has(extension);
  }
}
