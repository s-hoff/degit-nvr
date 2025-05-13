const { argv } = require('node:process')
const { join } = require('node:path')
const { readFile, writeFile } = require('node:fs/promises')

const degit = require('degit')

const [_execPath, _filepath, source, name] = argv

const emitter = degit(source);

emitter.on('info', info => {
	console.log(info.message);
});

emitter.clone('./' + name)
  .then(() => Promise.all([
    readFile(join('./' + name, 'package.json'), 'utf8'),
    readFile(join('./' + name, 'package-lock.json'), 'utf8'),
  ]))
  .then(([packageJson, packageLock]) => Promise.all([
    writeFile(join('./' + name, 'package.json'), packageJson.replaceAll('package-name', name), 'utf8'),
    writeFile(join('./' + name, 'package-lock.json'), packageLock.replaceAll('package-name', name), 'utf8'),
  ]))
  .then(() => console.log(`
Successfully created ${name} from ${target} in './${name}'
Run this to finish and test the setup:
cd ./${name}
npm install
npm run dev 
  `))
