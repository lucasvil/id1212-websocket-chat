let chatRooms = new Array();

function addChatRoom(user, other) {
  var chatRoom = {
    user: {
      name: user,
      history: new Array(),
    },
    other: {
      name: other,
      history: new Array(),
    },
    unreadMessages: 0,
  }
  chatRooms.push(chatRoom);
}

function findChatRoom(user1, user2) {
  let r = null;
  chatRooms.map(room => {
    if ((room.user.name == user1) && (room.other.name == user2)) {
      r = room;
    }
  });
  return r;
}

function appendUserHistory(user, other, message) {
  let room = findChatRoom(user, other);
  if (room != null) {
    room.user.history.push(message);
    return message;
  }
}

function appendOtherHistory(user, other, text) {
  let room = findChatRoom(user, other);
  let message = {
    time: new Date(),
    text: text,
  }
  if (room != null) {
    room.other.history.push(message);
    return message;
  }
}

function incrementUnread(user, other) {
  let room = findChatRoom(user, other);
  if (room != null) {
    room.unreadMessages++;
  }
  return room.unreadMessages;
}

function readUnread(user, other) {
  let room = findChatRoom(user, other);
  if (room != null) {
    room.unreadMessages = 0;
  }
}