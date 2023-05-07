const { createWriteStream, createReadStream } = require('fs');
const { join } = require('path');
const { readdir } = require('fs/promises');
const { pipeline } = require('stream');

const destFile = join(process.argv[1], 'project-dist', 'bundle.css');
const sourcePath = join(process.argv[1], 'styles');

mergeFiles(sourcePath, destFile, 'css');

async function mergeFiles(sourcePath, destinationFile, fileExtention) {
  try {
    const dirEntries = await readdir(sourcePath, { withFileTypes: true });
    const files = dirEntries
      .filter(entry => entry.isFile() && entry.name.match(new RegExp(`.${fileExtention}$`, 'i')));

    createWriteStream(destinationFile).close(); // clear destination file

    for (const file of files) {
      pipeline(
        createReadStream(join(sourcePath, file.name), 'utf-8'),
        createWriteStream(destinationFile, { flags: 'a+' }),
        (error) => { if (error) { console.error(error); } });
    }
  } catch (error) {
    console.error(error);
  }
}

