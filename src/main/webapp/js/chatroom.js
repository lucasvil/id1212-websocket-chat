let chatRooms = new Array();

function addChatRoom(user, other) {
  var room = {
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
  chatRooms.push(room);
  return room;
}

function findChatRoom(user1, user2) {
  let r = null;
  chatRooms.map(room => {
    if ((room.user.name == user1) && (room.other.name == user2)) {
      r = room;
    }
  });
  if (r == null)
    r = addChatRoom(user1, user2);
  return r;
}

function appendUserHistory(user, other, message) {
  let room = findChatRoom(user, other);
  if (room != null) {
    room.user.history.push(message);
  }
}

function appendOtherHistory(user, other, message) {
  let room = findChatRoom(user, other);
  if (room != null) {
    room.other.history.push(message);
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