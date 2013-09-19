$('body').prepend('<div id="time-wasted-warning">00:00:00</div>');

var timeWastedWarning = $('#time-wasted-warning');

timeWastedWarning.css('background-color', 'red');
timeWastedWarning.css('height', '50px');
timeWastedWarning.css('text-align', 'center');
timeWastedWarning.css('font-weight', 'bold');
timeWastedWarning.css('font-family', 'helvetica');
timeWastedWarning.css('font-size', '40px');
timeWastedWarning.css('color', 'white');
document.onmousemove = function(){
  //self.port.emit('detectMouse',1);
  console.log('bla');
};

$('body').mousemove(function(){
  console.log('woopwoop');
});
self.port.on('updateClock', function(updatedTime){
  timeWastedWarning.html(updatedTime);
});
$('a.UFILikeLink').each(function(index){
  console.log($(this).text());
});
