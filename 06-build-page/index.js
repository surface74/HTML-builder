const { createWriteStream, createReadStream } = require('fs');
const { join } = require('path');
const { rm, mkdir, readdir, copyFile, readFile, writeFile } = require('fs/promises');

buildPage(process.argv[1]);

async function buildPage(root) {
  try {
    const destinationDir = join(root, 'project-dist');
    await mkdir(destinationDir, { recursive: true });
    await mergeFiles(join(root, 'styles'), join(destinationDir, 'style.css'), 'css');
    await copyDir(join(root, 'assets'), join(destinationDir, 'assets'));

    let template = await readFile(join(root, 'template.html'), 'utf-8');
    const patterns = Array.from(template.matchAll(/{{(\w+)}}/g));

    for (const element of patterns) {
      const pattern = element[1];
      const content = await readFile(join(root, 'components', `${pattern}.html`), 'utf-8');
      template = template.replace(new RegExp(`{{${pattern}}}`, 'g'), content);
    }

    await writeFile(join(destinationDir, 'index.html'), template);
  } catch (err) {
    console.error(err);
  }
}

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
