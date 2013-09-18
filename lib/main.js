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
var self = require("sdk/self");

if(self.loadReason == 'install' || self.loadReason == 'enable' || self.loadReason == 'update' || self.loadReason == 'downgrade'){
  ss.storage.timeSpent = {seconds: timeSpent, when: today.getDate()}; 
}


if(is_today()){
  timeSpent = parseInt(ss.storage.timeSpent.seconds);
}

function is_today(){
  if(ss.storage.timeSpent.when == today.getDate()){
    return true;
  } else {
    return false;
  }
}

function checkFBStatus(){
  var tabs = require("sdk/tabs");
  if(tabs.activeTab.url != undefined){
    if(tabs.activeTab.url.match(/facebook/g)){
      timeSpent += 1; 
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
