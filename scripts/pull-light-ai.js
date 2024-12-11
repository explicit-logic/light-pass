import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

// Get command line argument for specific file
const specificFile = process.argv[2];

const targetDir = './src-tauri/binaries/light-ai';
fs.mkdirSync(targetDir, { recursive: true });

/**
 * Creates a console progress bar
 * @param {number} size - Total size in bytes
 * @param {string} filename - Name of the file being downloaded
 * @returns {Object} Progress bar methods
 */
function createProgressBar(size, filename) {
  const barLength = 30;
  let current = 0;

  function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  function update(chunk) {
    current += chunk.length;
    const percentage = (current / size) * 100;
    const filled = Math.floor((percentage * barLength) / 100);
    const empty = barLength - filled;

    const filledBar = '█'.repeat(filled);
    const emptyBar = '░'.repeat(empty);
    const progressBar = `${filledBar}${emptyBar}`;

    const stats = `${formatSize(current)}/${formatSize(size)}`;

    process.stdout.write(`\r${filename} [${progressBar}] ${percentage.toFixed(2)}% ${stats}`);
  }

  function end() {
    process.stdout.write('\n');
  }

  return { update, end };
}

/**
 * Makes a file executable on Unix-like systems
 * @param {string} filePath - Path to the file
 */
function makeExecutable(filePath) {
  // Skip for Windows systems
  if (process.platform === 'win32') return;

  try {
    // Add executable permissions (user+group+other)
    const mode = fs.statSync(filePath).mode;
    const executableMode = mode | 0o111; // adds executable bit for user, group, and others
    fs.chmodSync(filePath, executableMode);
    console.log(`Made executable: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Failed to make executable: ${path.basename(filePath)}`, error.message);
  }
}

/**
 * Downloads a file from a URL to a specified path with progress bar
 * @param {string} url - The URL to download from
 * @param {string} destPath - The destination path for the file
 * @returns {Promise<void>}
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const options = {
      headers: {
        'User-Agent': 'Node.js Release Asset Downloader',
        // 'Authorization': 'token YOUR_GITHUB_TOKEN'
      },
    };

    https
      .get(url, options, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        const totalSize = Number.parseInt(response.headers['content-length'], 10);
        const progressBar = createProgressBar(totalSize, path.basename(destPath));

        response.on('data', (chunk) => {
          progressBar.update(chunk);
        });

        response.pipe(file);

        file.on('finish', () => {
          progressBar.end();
          file.close(() => {
            makeExecutable(destPath);
            resolve();
          });
        });
      })
      .on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

/**
 * Gets latest release assets from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array>}
 */
async function getLatestReleaseAssets(owner, repo) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Node.js Release Asset Downloader',
        // 'Authorization': 'token YOUR_GITHUB_TOKEN'
      },
    };

    https
      .get(apiUrl, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          if (response.statusCode !== 200) {
            reject(new Error(`API request failed: ${response.statusCode}`));
            return;
          }

          try {
            const releaseData = JSON.parse(data);
            resolve(releaseData.assets);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * Lists all available assets in the latest release
 * @param {Array} assets - Array of release assets
 */
function listAvailableAssets(assets) {
  console.log('\nAvailable assets in the latest release:');
  for (const asset of assets) {
    console.log(`- ${asset.name}`);
  }
  console.log('');
}

/**
 * Main function to download assets from latest release
 */
async function downloadLatestReleaseAssets() {
  try {
    console.log('Fetching latest release assets...');
    const assets = await getLatestReleaseAssets('explicit-logic', 'light-ai');

    if (!assets || assets.length === 0) {
      console.log('No assets found in the latest release.');
      return;
    }

    // Always show available assets
    listAvailableAssets(assets);

    if (specificFile) {
      // Find the specific asset
      const asset = assets.find((a) => a.name === specificFile);
      if (!asset) {
        console.error(`Error: File "${specificFile}" not found in the latest release.`);
        return;
      }
      console.log(`Downloading specific file: ${specificFile}\n`);
      const destPath = path.join(targetDir, asset.name);
      await downloadFile(asset.browser_download_url, destPath);
    } else {
      // Download all assets
      console.log(`Downloading all ${assets.length} assets...\n`);
      for (const asset of assets) {
        const destPath = path.join(targetDir, asset.name);
        await downloadFile(asset.browser_download_url, destPath);
      }
    }

    console.log('\nDownload completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Print usage information if --help or -h is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node pull-light-ai.js [filename]

Options:
  No argument     Downloads all files from the latest release
  filename        Downloads only the specified file from the latest release
  --help, -h     Shows this help message

Available assets in the latest release:
- light-ai-aarch64-apple-darwin
- light-ai-x86_64-apple-darwin
- light-ai-x86_64-pc-windows-msvc.exe
- light-ai-x86_64-unknown-linux-gnu

Example:
  node pull-light-ai.js                                      # Downloads all files
  node pull-light-ai.js light-ai-x86_64-apple-darwin         # Downloads only the specified file
    `);
  process.exit(0);
}

// Start the download process
downloadLatestReleaseAssets();
