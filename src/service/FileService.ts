import { readFileSync, writeFileSync } from 'fs';

export class FileService {
  constructor() {}

  readFile(url: string) {
    const file = readFileSync(url, { encoding: 'utf8', flag: 'r' });
    return file;
  }

  writeFile(rawData: string) {
    const data = Buffer.from(rawData, 'utf8');
    writeFileSync('output/result.txt', data);
  }
}
