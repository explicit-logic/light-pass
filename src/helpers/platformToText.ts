export function platformToText(platform: PlatformType) {
  const { browser, os, type, version } = platform;
  const parts = [];

  if (!platform) {
    return '';
  }

  if (os) {
    parts.push(os === 'macos' ? 'macOS' : os);
  }

  if (browser) {
    if (version) {
      parts.push(`${browser} ${version}`);
    } else {
      parts.push(browser);
    }
  }

  return (type ? type.concat(': ') : '').concat(parts.join(', '));
}
