var steps = [];
var testindex = 0;
var doNext = true;
var doing = false;
var loadInProgress = false; //This is set to true when a page is still loading
var links;

var charsPushed = 0;

/*********SETTINGS*********************/
var webPage = require('webpage');
var page = webPage.create();
page.settings.userAgent =
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false; //Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;

function finish() {
  phantom.exit();
}
// function openCharacterPage(url) {
//   return function() {
//     console.log('Loading character page: [' + url + ']');
//     page.open(url);
//   };
// }

// function scrapeCharacterPage(url) {
//   return function() {
//     page.render(url.replace(/[^a-zA-Z0-9]/, '_') + '.png');
//   };
// }

/*********SETTINGS END*****************/

console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
  console.log(msg);
};
/**********DEFINE STEPS THAT FANTOM SHOULD DO***********************/
steps = [
  //Step 1 - Open Amazon home page
  function() {
    console.log('Step 1 - Open WaniKani login page');
    page.open('https://www.wanikani.com/login', function(status) {});
  },
  //Step 2 - Populate and submit the login form
  function() {
    console.log('Step 2 - Populate and submit the login form');
    page.evaluate(function() {
      document.getElementById('user_login').value = 'learningkanji0';
      document.getElementById('user_password').value = 'dickball1';
      document.getElementById('new_user').submit();
    });
  },
  //Step 3 - Wait WaniKani to login user. After user is successfully logged in, user is redirected to home page. Content of the home page is saved to WaniKani.html. You can find this file where phantomjs.exe file is. You can open this file using Chrome to ensure that you are logged in.
  function() {
    console.log('Step 3 - Open vocab list page.');
    page.open(
      'https://www.wanikani.com/vocabulary?difficulty=PLEASANT',
      function() {}
    );
  },
  function() {
    console.log('Step 4 - Select all links for vocab');
    // page.render('vocab_1-10.png');
    links = page.evaluate(function() {
      return [].slice
        .call(document.querySelectorAll('.character-item'))
        .map(function(item) {
          return item.getElementsByTagName('a')[0].href;
        });
    });
    var fs = require('fs');
    var path = require('path');
    fs.writeFile(
      path.join(__dirname, './links.json'),
      JSON.stringify(links),
      'utf8',
      function(err) {
        if (err) {
          console.log(err);
        }
      }
    );
  },
  function() {
    // console.log('Step 5 - Load character page');
    // for (var i = 0; i < 5; i++) {
    //   var url = links[i];
    //   // steps.splice(steps.length - 1, 0, openCharacterPage(url));
    //   // steps.splice(steps.length - 1, 0, scrapeCharacterPage(url));
    //   // steps.push(openCharacterPage(url));
    //   // steps.push(scrapeCharacterPage(url));
    //   page.open(url, function() {
    //     page.render(url.replace(/[^a-zA-Z0-9]/g, '_') + '.png');
    //   });
    // }
    setTimeout(function() {
      phantom.exit();
    }, 2000);
  }
];
/**********END STEPS THAT FANTOM SHOULD DO***********************/

//Execute steps one by one
interval = setInterval(executeRequestsStepByStep, 150);

function executeRequestsStepByStep() {
  if (loadInProgress == false && typeof steps[testindex] == 'function') {
    //console.log("step " + (testindex + 1));
    steps[testindex]();
    testindex++;
  }

  if (typeof steps[testindex] != 'function') {
    console.log('test complete!');
    // phantom.exit();
  }
}

/**
 * These listeners are very important in order to phantom work properly. Using these listeners, we control loadInProgress marker which controls, weather a page is fully loaded.
 * Without this, we will get content of the page, even a page is not fully loaded.
 */
page.onLoadStarted = function() {
  loadInProgress = true;
  console.log('Loading started');
};
page.onLoadFinished = function() {
  loadInProgress = false;
  console.log('Loading finished');
};
page.onConsoleMessage = function(msg) {
  console.log(msg);
};
