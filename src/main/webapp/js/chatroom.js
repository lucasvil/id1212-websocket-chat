let chatRooms = new Array();

function addChatRoom(name) {
  var room = {
    user: {
      history: new Array(),
    },
    other: {
      history: new Array(),
    },
    unreadMessages: 0,
    name: name,
  }
  chatRooms.push(room);
  return room;
}

function findChatRoom(name) {
  let r = null;
  chatRooms.map(room => {
    if (room.name == name) {
      r = room;
    }
  });
  if (r == null)
    r = addChatRoom(name);
  return r;
}

function appendUserHistory(name, message) {
  let room = findChatRoom(name);
  if (room != null) {
    room.user.history.push(message);
  }
}

function appendOtherHistory(name, message) {
  let room = findChatRoom(name);
  if (room != null) {
    room.other.history.push(message);
  }
}

function incrementUnread(name) {
  let room = findChatRoom(name);
  if (room != null) {
    room.unreadMessages++;
  }
  return room.unreadMessages;
}

function readUnread(name) {
  let room = findChatRoom(name);
  if (room != null) {
    room.unreadMessages = 0;
  }
}