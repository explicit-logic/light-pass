export function binaryToBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return textToBase64(binary);
}

export function textToBase64(text: string) {
  return window.btoa(text);
}
