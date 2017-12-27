const casper = require('casper').create();
casper.start('https://www.wanikani.com/login');
var links = [];

function login() {
  document.getElementById('user_login').value = 'learningkanji0';
  document.getElementById('user_password').value = 'dickball1';
  document.getElementById('new_user').submit();
}

function getLinks() {
  return Array.prototype.map.call(
    document.querySelectorAll('.character-item'),
    function(item) {
      return item.querySelector('a')[0].href;
    }
  );
}

casper.then(function() {
  console.log('Step 1 - login');
  this.evaluate(login);
});

casper.thenOpen(
  'https://www.wanikani.com/vocabulary?difficulty=PLEASANT',
  function() {
    console.log('Step 2 - open character list page for levels 1 - 10');
    links = this.evaluate(getLinks);
  }
);

// casper.then(function() {
//   console.log('links', links);
// });

casper.run(function() {
  console.log('links: ', links);
});

/* var casper = require('casper').create();
var links;

function getLinks() {
  // Scrape the links from top-right nav of the website
  var links = document.querySelectorAll('ul.navigation li a');
  return Array.prototype.map.call(links, function(e) {
    return e.getAttribute('href');
  });
}

// Opens casperjs homepage
casper.start('http://casperjs.org/');

casper.then(function() {
  links = this.evaluate(getLinks);
});

casper.run(function() {
  for (var i in links) {
    console.log(links[i]);
  }
  // casper.done();
});
 */
