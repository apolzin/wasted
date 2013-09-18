$('body').prepend('<div id="time-wasted-warning">00:10:32</div>');
var timeWastedWarning = $('#time-wasted-warning');
timeWastedWarning.css('background-color', 'red');
timeWastedWarning.css('height', '50px');
timeWastedWarning.css('text-align', 'center');
timeWastedWarning.css('font-weight', 'bold');
timeWastedWarning.css('font-family', 'helvetica');
timeWastedWarning.css('font-size', '40px');
timeWastedWarning.css('color', 'white');

self.port.on('updateClock', function(updatedTime){
  timeWastedWarning.html(updatedTime);
});
