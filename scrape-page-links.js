var fs = require('fs');

var casper = require('casper').create();
var config = require('./config/index.js');
var links = [];
var index = 0;
var mp3Urls = [];

function login() {
  document.getElementById('user_login').value = config.wk_username;
  document.getElementById('user_password').value = config.wk_password;
  document.getElementById('new_user').submit();
}

function getLinks() {
  var _links = document.querySelectorAll('.character-item');
  return [].map.call(_links, function(e) {
    return e.querySelector('a').href;
  });
}

casper.start('https://www.wanikani.com/login');

casper.then(function() {
  console.log('Step 1 - login');
  this.evaluate(login);
});

casper.thenOpen(
  'https://www.wanikani.com/vocabulary?difficulty=PLEASANT',
  function() {
    console.log('Step 2 - open character list page for levels 1 - 10');
  }
);

casper.then(function() {
  casper.capture('screenshots/lvl1_10.png');
  links = this.evaluate(getLinks);
});

casper.run(function() {
  fs.write(
    fs.pathJoin(fs.workingDirectory, 'pages.json'),
    JSON.stringify(links),
    'w'
  );
});
