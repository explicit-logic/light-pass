import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { pdfMake } from './pdfMake';

// import { open } from '@tauri-apps/api/shell';

export async function upload(documentDefinition: TDocumentDefinitions) {
  try {
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    const blob = await new Promise<Blob>((resolve, reject) => {
      try {
        pdfDocGenerator.getBlob(resolve);
      } catch (error) {
        reject(error);
      }
    });
    const formdata = new FormData();
    formdata.append('file', blob, `${Date.now()}.pdf`);
    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formdata,
    });
    const { data } = (await response.json()) as { data: { url: string } };
    const { url } = data;
    const downloadUrl = url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

    return downloadUrl;
    // await open(`tg://msg_url?url=${downloadUrl}&text=Test Results`);
  } catch (error) {
    console.error(error);
  }
}
