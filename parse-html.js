const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function getHtmlFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, './html'), 'utf8', (err, files) => {
      if (err) {
        console.log(err);
        return;
      }
      resolve(files);
    });
  });
}

function readHtmlFile(fpath) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, './html', fpath),
      'utf8',
      (err, contents) => {
        if (err) {
          console.log(err);
          return;
        }
        resolve(contents);
      }
    );
  });
}

async function parseHtml(fpath) {
  let html = await readHtmlFile(fpath);
  // console.log(html.length);
  let $ = cheerio.load(html);
  return $('source[type="audio/mpeg"]').attr('src');
}

async function main() {
  let files = await getHtmlFiles();
  let urls = await Promise.all(files.map(parseHtml));
  fs.writeFile(
    path.join(__dirname, './mp3-urls.json'),
    JSON.stringify(urls),
    'utf8',
    err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('done');
    }
  );
}

main();
