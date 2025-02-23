import axios, { AxiosError } from 'axios';
import { UploadResult } from '../types';
import FormData from 'form-data';

export abstract class BaseUploadService {
  protected readonly uploadConfig = {
    maxRetries: 3,
    delayBetweenRetries: 1000,
  };

  protected abstract formatUploadData(filePath: string): FormData;
  protected abstract getUploadUrl(): string;
  protected abstract getHeaders(formData: FormData): Record<string, string>;

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected formatError(error: unknown, filePath: string): string {
    if (error instanceof AxiosError) {
      return `API Error (${error.response?.status || 'unknown'}): ${error.response?.data?.message || error.message}`;
    }
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }

  public async uploadFile(filePath: string): Promise<UploadResult> {
    let lastError: string | undefined;
    
    for (let attempt = 1; attempt <= this.uploadConfig.maxRetries; attempt++) {
      try {
        const formData = this.formatUploadData(filePath);
        const response = await axios.post(
          this.getUploadUrl(),
          formData,
          { headers: this.getHeaders(formData) }
        );

        return {
          success: true,
          filePath,
          statusCode: response.status
        };
      } catch (error) {
        lastError = this.formatError(error, filePath);
        
        if (attempt < this.uploadConfig.maxRetries) {
          await this.delay(this.uploadConfig.delayBetweenRetries);
          continue;
        }
      }
    }

    return {
      success: false,
      filePath,
      error: lastError
    };
  }
}
