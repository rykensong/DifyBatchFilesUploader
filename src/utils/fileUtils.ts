import fs from 'fs/promises';
import path from 'path';

export async function *walkDirectory(dir: string, isSupportedFile: (filename: string) => boolean): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      yield* walkDirectory(fullPath, isSupportedFile);
    } else if (entry.isFile() && isSupportedFile(entry.name)) {
      yield fullPath;
    }
  }
}

export async function readFileContent(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}