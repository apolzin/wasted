var rainbowStart = '<span style="color: white; background: -moz-linear-gradient(to bottom, #ffc600, #fc8901, #f2005b, #782fff, #015eb4, #00a2ca, #93d800)">';
var rainbowStop = '</span>';
var widgets = require("sdk/widget");
var widget = widgets.Widget({
  id: "facebook-timer",
  label: "facebook timer",
  content: rainbowStart + '00:00:00' + rainbowStop,
  width: 50
});


var timerHalted = false;
var ss = require("sdk/simple-storage");
var today = new Date();
var timeSpent = 0;
var maxTime = require('sdk/simple-prefs').prefs['TimeUntilWarning'] * 60;
var self = require("sdk/self");
var warningAttached = 0;
var worker;
var tabs = require("sdk/tabs");

require('sdk/simple-prefs').on('TimeUntilWarning', function(ev){
  maxTime = require('sdk/simple-prefs').prefs['TimeUntilWarning'] * 60;
});

/*var warningPanel = require("sdk/panel").Panel({
  width: 200,
  height: 200,
  contentScriptWhen: 'ready',
  contentScriptFile: self.data.url(['jquery-1.10.2.min.js',
    'warning-panel.js']),
  contentURL: self.data.url('warning-panel.html')
});
widget.panel = warningPanel;
widget.panel.show();
*/
// idle timer
var events = require("sdk/system/events");

function counterStop(){
  timerHalted = true;
}
function counterStart(){
  timerHalted = false;
}

function padWarningTime(time){
  var timeStr = '<span style="background-color:red; color: white;">' + time + '</span>';
  return timeStr;
}
function padRainbowTime(time){
  var timeStr = rainbowStart + time + rainbowStop;
  return timeStr;
}
events.on('user-interaction-inactive', counterStop);
events.on('user-interaction-active', counterStart);


if(self.loadReason == 'install' || self.loadReason == 'enable' || self.loadReason == 'update' || self.loadReason == 'downgrade'){
  ss.storage.timeSpent = {seconds: timeSpent, when: today.getDate()}; 
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



function checkFBStatus(){
  var tabs = require("sdk/tabs");
  var data = require("sdk/self").data;

  if(tabs.activeTab.url != undefined){
    if(tabs.activeTab.url.match(/facebook\.com/g)){
      if(!timerHalted){
        timeSpent += 1;
      }
      if(timeSpent > maxTime){
        widget.content = padWarningTime(toHHMMSS(timeSpent));
      }else{
        widget.content = padRainbowTime(toHHMMSS(timeSpent));
      }
    }
    if(is_today() == false){
      ss.storage.timeSpent = {seconds: 0, when: today.getDate()};
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
