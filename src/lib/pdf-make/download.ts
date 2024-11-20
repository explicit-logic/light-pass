import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { pdfMake } from './pdfMake';

import { save } from '@tauri-apps/api/dialog';
import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

export async function download(documentDefinition: TDocumentDefinitions) {
  const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    try {
      pdfDocGenerator.getBuffer(resolve);
    } catch (error) {
      reject(error);
    }
  });
  const downloadDirPath = await path.downloadDir();
  const defaultPath = await path.join(downloadDirPath, `${Date.now()}.pdf`);
  const filePath = await save({ defaultPath });
  if (!filePath) {
    throw new Error('Cancelled');
  }
  await fs.writeBinaryFile(filePath, buffer);
}
