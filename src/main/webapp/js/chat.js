const url = 'http://localhost:8080';
let stompClient;
let selectedUser;

function connectToChat(userName) {
    console.log("connecting to chat...")
    let socket = new SockJS(url + '/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to: " + frame);
        stompClient.subscribe("/topic/messages/" + userName, function (response) {
            let data = JSON.parse(response.body);
            let room = findChatRoom(userName, data.from);
            if (room == null) {
                console.log(room);
                addChatRoom(userName, data.from)
            }
            if (selectedUser === data.from) {
                if (data.message) {
                    // add to chatroom object
                    appendOtherHistory(userName, data.from, data.message);
                    renderResponse(data.message, data.from);
                }
                else if (data.file)
                    // add to chatroom object
                    renderImageResponse(data.file, data.from, data.base64);
            } else {
                appendOtherHistory(userName, data.from, data.message);
                let element = document.getElementById("newMessage_" + data.from);
                if (element)
                    element.parentNode.removeChild(element);
                let count = incrementUnread(userName, data.from);
                $('#userNameAppender_' + data.from).append('<span id="newMessage_' + data.from + '" style="color: red">+' + count + '</span>');
            }
        });
    });
    fetchAll();
}

function sendMsg(from, text) {
    let room = findChatRoom(from, selectedUser);
    if (room == null) {
        console.log(room);
        addChatRoom(from, selectedUser)
    }
    appendUserHistory(from, selectedUser, text);
    stompClient.send("/app/chat/msg/" + selectedUser, {}, JSON.stringify({
        from: from,
        message: text
    }));
}

function uploadFile(from, file, base64) {
    stompClient.send("/app/chat/file/" + selectedUser, {}, JSON.stringify({
        from: from,
        file: file,
        base64: base64
    }));
}

function registration() {
    let userName = document.getElementById("userName").value;
    document.cookie = "username=" + userName;
    $.get(url + "/registration/" + userName, function (response) {
        connectToChat(userName);
    }).fail(function (error) {
        if (error.status === 400) {
            alert("Login is already busy!")
        }
    })
}

function selectUser(select) {
    console.log("selecting users: " + select);
    let user = getCookie("username");
    selectedUser = select;

    clearHistory();
    readUnread(user, selectedUser);

    let room = findChatRoom(user, selectedUser);
    if (room == null) {
        console.log(room);
        addChatRoom(user, selectedUser)
        room = findChatRoom(user, selectedUser);
    }

    let sent = room.user.history;
    let recieved = room.other.history;
    let scount = 0;
    let rcount = 0;

    for (let i = 0; i < (sent.length + recieved.length); i++) {
        if (sent.length == 0) {
            renderResponse(recieved[rcount].text, user);
            rcount++;
        } else if (recieved.length == 0) {
            renderResponse(sent[scount].text, user);
            scount++;
        } else {
            if (sent[scount].time > recieved[rcount].time) {
                renderResponse(sent[scount].text, user);
                scount++;
            } else {
                renderResponse(recieved[rcount].text, user);
                rcount++;
            }
        }
    }

    let isNew = document.getElementById("newMessage_" + selectedUser) !== null;
    if (isNew) {
        let element = document.getElementById("newMessage_" + selectedUser);
        element.parentNode.removeChild(element);
    }

    $('#selectedUserId').html('');
    $('#selectedUserId').append('Chat with ' + selectedUser);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function fetchAll() {
    let userName = getCookie("username");
    $.get(url + "/fetchAllUsers", function (response) {
        let users = response;
        let usersTemplateHTML = "";
        console.log(userName);
        for (let i = 0; i < users.length; i++) {
            if (!(userName == users[i])) {
                usersTemplateHTML = usersTemplateHTML + '<a href="#" onclick="selectUser(\'' + users[i] + '\')"><li class="clearfix">\n' +
                    '                <div class="about">\n' +
                    '                <img src="../images/gurka.jpeg" width="55px" height="55px" alt="avatar" />\n' +
                    '                    <div id="userNameAppender_' + users[i] + '" class="name">' + users[i] + '</div>\n' +
                    '                    <div class="status">\n' +
                    '                        <i class="fa fa-circle offline"></i>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </li></a>';
            }
        }
        $('#usersList').html(usersTemplateHTML);
    });
}
