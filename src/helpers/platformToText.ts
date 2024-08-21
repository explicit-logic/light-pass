export function platformToText(platform: PlatformType) {
  if (!platform) {
    return '';
  }
  const { browser, os, type, version } = platform;
  const parts = [];

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

  return (type ? capitalizeFirstLetter(type).concat(': ') : '').concat(parts.join(', '));
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
