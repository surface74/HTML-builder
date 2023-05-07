const { join } = require('path');
const { argv } = require('process');
const { readdir, mkdir, rm, copyFile } = require('fs/promises');

const source = join(argv[1], 'files');
const destination = join(argv[1], 'files-copy');

copyDir(source, destination);

async function copyDir(source, destination) {
  try {
    await mkdir(destination, { recursive: true });

    const sourceEntity = await readdir(source, { withFileTypes: true });

    for (const entity of sourceEntity) {
      if (entity.isDirectory()) {
        await copyDir(join(source, entity.name), join(destination, entity.name));
      }
    }
    const sourceFiles = sourceEntity.filter(entity => entity.isFile()).map(file => file.name);

    const destFiles = await (await readdir(destination, { withFileTypes: true }))
      .filter(entity => entity.isFile())
      .map(file => file.name);

    for (const file of destFiles) {
      if (!sourceFiles.includes(file)) {
        await rm(join(destination, file));
      }
    }

    for (const file of sourceFiles) {
      await copyFile(join(source, file), join(destination, file));
    }

  } catch (err) {
    console.error(err);
  }
}

