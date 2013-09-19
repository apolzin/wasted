var widgets = require("sdk/widget");
var widget = widgets.Widget({
  id: "facebook-timer",
  label: "facebook timer",
  content: "00:00:00",
  width: 50
});

var ss = require("sdk/simple-storage");
var today = new Date();
var timeSpent = 0;
var maxTime = 1 * 60;
var self = require("sdk/self");
var warningAttached = 0;
var worker;

if(self.loadReason == 'install' || self.loadReason == 'enable' || self.loadReason == 'update' || self.loadReason == 'downgrade'){
  ss.storage.timeSpent = {seconds: timeSpent, when: today.getDate()}; 
  ss.storage.config = {urls: ['facebook.com', 'reddit.com'], warning: 15};
}


if(is_today()){
  timeSpent = parseInt(ss.storage.timeSpent.seconds);
}

function is_today(){
  if(ss.storage.timeSpent != undefined){
    if(ss.storage.timeSpent.when == today.getDate()){
      return true;
    } else {
      return false;
    }
  }
}

function attachWarning(tabs){
  warningAttached = 1;
  var data = require('sdk/self').data;
  if(tabs.activeTab.url.match(/facebook/g)){
    tabs.activeTab.attach({
      contentScriptWhen: 'ready',
      contentScriptFile: [data.url('jquery-1.10.2.min.js'),
        data.url('fb-warning.js')]
    });
  }
  return tabs;
}

function checkFBStatus(){
  var tabs = require("sdk/tabs");
  var data = require("sdk/self").data;

  if(tabs.activeTab.url != undefined){
    if(tabs.activeTab.url.match(/facebook\.com/g)){
      timeSpent += 1;
      if(timeSpent > maxTime && warningAttached == 0){
        warningAttached = 1;
        worker = tabs.activeTab.attach({
          contentScriptWhen: 'ready',
          contentScriptFile: [data.url('jquery-1.10.2.min.js'),
                              data.url('fb-warning.js')]
        });
        worker.port.emit('updateClock', toHHMMSS(timeSpent));
      }else if(timeSpent > maxTime && warningAttached == 1){
        worker.port.emit('updateClock', toHHMMSS(timeSpent));
      }
      widget.content = toHHMMSS(timeSpent);
    }
  } else {
      ss.storage.timeSpent = {seconds: timeSpent, when: today.getDate()};
  }
  require('sdk/timers').setTimeout(checkFBStatus, 1000);
}

function saveStatus(){
  ss.storage.timeSpent = {seconds: timeSpent, when: today.getDate()};
  require('sdk/timers').setTimeout(saveStatus, 5000);
}
require('sdk/timers').setTimeout(saveStatus, 5000);

function resetTimeSpent(){
  timeSpent = 0;
}

function toHHMMSS(secs){
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);
  if(hours < 10){
    hours = "0" + hours;
  }
  if(minutes < 10){
    minutes = "0" + minutes;
  }
  if(seconds < 10){
    seconds = "0" + seconds;
  }
  var time = hours + ':' + minutes + ':' + seconds;
  return time;
}
require('sdk/timers').setTimeout(checkFBStatus, 1000);
