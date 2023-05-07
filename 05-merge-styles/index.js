const { createWriteStream, createReadStream } = require('fs');
const { argv } = require('process');
const { join } = require('path');
const { readdir } = require('fs/promises');

const destFile = join(argv[1], 'project-dist', 'bundle.css');
const sourcePath = join(argv[1], 'styles');
const output = createWriteStream(destFile);

mergeFiles(sourcePath, destFile, 'css');

async function mergeFiles(sourcePath, destinationFile, fileExtention) {
  const dirContent = await readdir(sourcePath, { withFileTypes: true });
  const files = dirContent
    .filter(entity => entity.isFile()
      && entity.name.match(new RegExp(`.${fileExtention}$`, 'i')))
    .map(entity => entity.name);

  let output = createWriteStream(destinationFile);
  files.forEach((file, index) => {
    if (index) {
      output = createWriteStream(destinationFile, { flags: 'a+' });
    }
    const input = createReadStream(join(sourcePath, file), 'utf-8');
    input.pipe(output);
  });
}

