var fs = require('fs');
var mm = require('musicmetadata');
var path = require('path');
var rss = require('rss');
var schedule = require('node-schedule');
var sourceDirectory = process.env.SRCDIR;
var targetDirectory = process.env.DESTDIR;

function json2rss() {
  fs.readFile(path.join(__dirname, 'channel.json'), function (e, s) {
    var input = JSON.parse(s);
    var feed = new rss(input.channel);

    input.items.forEach(function (item) {
      feed.item(item);
    });

    var output = feed.xml({ indent: true });
    fs.writeFile(path.join(targetDirectory, 'rss.xml'), output, function (e) {
      if (e) {
        console.error(e);
      }
    });
  });
}

var rule = new schedule.RecurrenceRule();
rule.minute = 0;
schedule.scheduleJob(rule, json2rss);
json2rss();