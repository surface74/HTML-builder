const { createReadStream } = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'text.txt');

const input = createReadStream(filePath, 'utf-8');
let data = '';

input.on('data', chunk => data += chunk);
input.on('end', () => console.log(data));
input.on('error', error => console.log('Error:', error.message));
