// Modules
import { locale as getLocale } from '@tauri-apps/api/os';

export async function getLocaleLang(): Promise<string> {
  const locale = await getLocale();

  if (locale) {
    const [lang] = locale.split('-');

    return lang;
  }

  return 'en';
}
