const path = require('path');
const fs = require('fs');
const request = require('request');
const config = require('../config');

function getMp3Data() {
  return new Promise((resolve, reject) => {
    var fpath = path.join(config.dataDir, 'mp3-urls.json');
    fs.readFile(fpath, 'utf8', function(err, contents) {
      if (err) {
        console.log(err);
        return;
      }
      resolve(JSON.parse(contents));
    });
  });
}

function saveData(data) {
  console.log('saving new data file');
  let fpath = path.join(config.dataDir, 'data.json');
  fs.writeFile(fpath, JSON.stringify(data), 'utf8', function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('done!');
    process.exit();
  });
}

function getMp3Fname(url) {
  let parts = url.split('/');
  let fname = parts.pop();
  parts = fname.split('.');
  fname = parts[0];
  fname = fname.replace(/[^a-z0-9]/gi, '_');
  return fname + '.mp3';
}

function pad(n, l) {
  n = n.toString();
  while (n.length < l) {
    n = `0${n}`;
  }
  return n;
}

function download(data, index = 0) {
  if (index >= data.length) {
    console.log('all mp3s downloaded');
    saveData(data);
    return;
  }
  let item = data[index];
  let fname = getMp3Fname(item.mp3);
  let fpath = path.join(config.dataDir, 'audio', fname);

  console.log(
    `downloading ${pad(index + 1, data.length.toString().length)} / ${
      data.length
    }`
  );

  let dl = request
    .get(item.mp3)
    .on('error', function(err) {
      if (err) console.log(err);
    })
    .pipe(fs.createWriteStream(fpath), { encoding: 'binary', flags: 'w' });
  dl.on('finish', () => {
    data[index].mp3_filename = fname;
    let wait = Math.floor(Math.random() * 1000);
    setTimeout(function() {
      download(data, index + 1);
    }, wait);
  });
}

async function main() {
  let data = await getMp3Data();
  download(data);
}

main();
