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

  return (type ? capitalizeFirstLetter(type).concat(': ') : '').concat(parts.join(', '));
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
