var fs = require('fs');
var casper = require('casper').create();
var config = require('../config/index.js');
var linksFpath = fs.pathJoin(config.dataDir, 'pages.json');
var links = JSON.parse(fs.read(linksFpath));
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
    var fpath = fs.pathJoin(
      config.dataDir,
      'html',
      link.replace(/[^a-z0-9]/gi, '_') + '.html'
    );
    fs.write(fpath, html, 'w');
  });
});

casper.run(function() {});
