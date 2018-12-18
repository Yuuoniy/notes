var Chat = function(socket) {
  this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(roomm) {
  this.socket.emit('join', {

  });
};

Chat.prototype.processCommand = function(command) {
  var words = command.split(' ');
  var command = words[0].substring(1, words[0].length).toLowerCase();
  var message = false;
  switch (command) {
    case 'join':
      words.shift();
      var room = words.join(' ');
      this.changeRoom(room);
      break;
    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      break;
    default:
      message = 'Unrecognized command.';
      break;
  }
  return message;
};

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;
  if (message.charAt[0] == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('room').text(), message);
    $('#messages').append(divSystemContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }
  $('#send-message').val('');
}


var socket = io.connect();
$(document).ready(function() {
  var chatApp = new Chat(socket);
  socket.on('nameResult', function(result) {
    var message;
    if (result.success) {
      message = 'You are known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#message').append(divSystemContentElement(message));
  });
  socket.on('joinResult', function(result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });
  socket.on('message', function(message) {
    var newElement = $('<div></div>').text(message.text);
    $('#message').append(newElement);
  });
  socket.on('rooms', function() {
    $('#room-list').empty();
    for (var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divSystemContentElement(room));
      }
    }
    $('#room-list div').click(function() {
      chatApp.processCommand('/join' + $(this).text());
      $('#send-message').focus();
    });
  });
  setInterval(function() {
    socket.emit('rooms');
  }, 1000);
  $('#send-message').focus();
  $('#send-form').submit(function() {
    processUserInput(chatApp, socket);
    return false;
  });
});
