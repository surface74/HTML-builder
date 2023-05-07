const { createWriteStream, createReadStream } = require('fs');
const { join } = require('path');
const { readdir } = require('fs/promises');

const destFile = join(process.argv[1], 'project-dist', 'bundle.css');
const sourcePath = join(process.argv[1], 'styles');

mergeFiles(sourcePath, destFile, 'css');

async function mergeFiles(sourcePath, destinationFile, fileExtention) {
  let output = createWriteStream(destinationFile);
  await readdir(sourcePath, { withFileTypes: true })
    .then(entries => entries
      .filter(entry => entry.isFile() && entry.name.match(new RegExp(`.${fileExtention}$`, 'i')))
      .forEach((entry, index) => {
        if (index) {
          output = createWriteStream(destinationFile, { flags: 'a+' });
        }
        const input = createReadStream(join(sourcePath, entry.name), 'utf-8');
        input.pipe(output);
      }))
    .catch(err => console.error(err));
}

