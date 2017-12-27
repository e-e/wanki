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
  let $ = cheerio.load(html);

  let data = {
    level: parseInt(
      $('a.level-icon')
        .text()
        .trim(),
      10
    ),
    mp3: $('source[type="audio/mpeg"]').attr('src'),
    character: $('.japanese-font-styling-correction')
      .text()
      .trim(),
    meaning: $('header h1')
      .text()
      .trim(),
    alt_meaning: $('.alternative-meaning p')
      .text()
      .trim(),
    kana: $('.vocabulary-reading p')
      .text()
      .trim()
  };

  data.meaning = data.meaning.replace(
    data.level.toString() + ' ' + data.character + ' ',
    ''
  );

  // console.log(html.length);
  return data;
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
