var widgets = require("sdk/widget");
var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  content: "00:00:00",
  width: 100
});

var ss = require("sdk/simple-storage");

var today = new Date();
var timeSpent = 0;

if(ss.storage.timeSpent == undefined){
  initializeStorage(today, timeSpent);
} else {
  if(is_today(ss)){
    timeSpent = ss.storage.seconds;
  }
}


exports.onUnload = function(reason){
  console.log('we out');
}


function is_today(ss){
  if(ss.storage.when.getDate() == today.getDate()){
    return true;
  } else {
    return false;
  }
}

function initializeStorage(when, howlong){
  ss.storage.timeSpent = {seconds: howlong, when: when};
}




function checkFBStatus(){
  var tabs = require("sdk/tabs");
  if(tabs.activeTab.url != undefined){
    if(tabs.activeTab.url.match(/facebook/g)){
      timeSpent += 1; 
      widget.content = timeSpent.toHHMMSS();
    }
  } else {
    console.log('we done');
    ss.storage.timeSpent = {seconds: timeSpent, when: today.getDate()};
    console.log(ss.storage.timeSpent);
  }
  require('timers').setTimeout(checkFBStatus, 1000);
}

function resetTimeSpent(){
  timeSpent = 0;
}

Number.prototype.toHHMMSS = function(){
  var sec_num = parseInt(this, 10);
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


require('timers').setTimeout(checkFBStatus, 1000);
