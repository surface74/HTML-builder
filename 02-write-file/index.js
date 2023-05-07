const { createWriteStream } = require('fs');
const { join } = require('path');
const { stdin, stdout, argv } = require('process');

const filePath = join(argv[1], 'output.txt');
const output = createWriteStream(filePath, 'utf-8');

stdout.write('Type the text:\n');

stdin.on('data', data => {
  const text = data.toString();
  if (text.trim() === 'exit') {
    sayBye();
  }
  output.write(text);
});

process.on('SIGINT', sayBye);

function sayBye() {
  console.log('Bye!');
  process.exit();
}
