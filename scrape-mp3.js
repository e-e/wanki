var fs = require('fs');

var casper = require('casper').create();
var links = JSON.parse(fs.read(fs.pathJoin(fs.workingDirectory, 'pages.json')));
var config = require('./config/index.js');
var index = 0;
var mp3Urls = [];

function getMp3Url() {
  var audio = document.querySelector('audio');
  var mp3s = audio.querySelector('source');
  for (var i = 0; i < mp3s.length; i++) {
    var mp3 = mp3s[i];
    var src = mp3.src;
    var parts = src.split('.');
    var ext = parts.pop();
    if (ext.trim().toLowerCase() === 'mp3') {
      return src;
    }
  }

  return audio.src;
  // return document.querySelector('source[type="audio/mpeg"]').src;
}

function login() {
  document.getElementById('user_login').value = config.wk_username;
  document.getElementById('user_password').value = config.wk_password;
  document.getElementById('new_user').submit();
}

function getPageHtml() {
  return document.all[0].outerHTML;
}

casper.start();

casper.start('https://www.wanikani.com/login');

casper.then(function() {
  console.log('Step 1 - login');
  this.evaluate(login);
});

casper.each(links, function(self, link) {
  var mp3 = '';
  this.thenOpen(link, function() {
    var html = this.evaluate(getPageHtml);
    fs.write(
      fs.pathJoin(
        fs.workingDirectory,
        'html',
        link.replace(/[^a-z0-9]/gi, '_') + '.html'
      ),
      html,
      'w'
    );
    /* this.echo('opened ' + link);
    // casper.capture('screenshots/' + link.replace(/[^a-z0-9]/gi, '_') + '.png');
    mp3 = this.evaluate(getMp3Url);
    this.echo('found: ' + mp3);
    mp3Urls.push(mp3); */
  });
  // this.then(function() {});
});

casper.run(function() {
  // console.log('links: ', links.length, links[0]);
  // fs.write(
  //   fs.pathJoin(fs.workingDirectory, 'pages.json'),
  //   JSON.stringify(links),
  //   'utf8',
  //   function(err) {
  //     if (err) console.log(err);
  //   }
  // );
  // this.echo('mp3 url: ' + mp3Urls[0]);
});
