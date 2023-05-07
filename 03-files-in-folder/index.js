const { join, basename, extname } = require('path');
const { argv } = require('process');
const { readdir, stat } = require('fs/promises');


getFilesInForlder(join(argv[1], 'secret-folder'));

async function getFilesInForlder(path) {
  try {
    const files = await readdir(path, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const fileStat = await stat(join(path, file.name));
        console.log(formatFileInfo(file.name, fileStat));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function formatFileInfo(fileName, fileStat) {
  return `${basename(fileName, extname(fileName))} - ${extname(fileName).slice(1)} - ${fileStat.size / 1000}Kb`;
}
