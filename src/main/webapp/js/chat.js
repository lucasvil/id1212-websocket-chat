const url = 'http://localhost:8080';
let stompClient;
let selectedUser;

function connectToChat(username) {
    console.log("connecting to chat...")
    let socket = new SockJS(url + '/chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        // callback function
        console.log("connected to: " + frame);
        stompClient.subscribe("/topic/messages/" + username, function (response) {
            let data = JSON.parse(response.body);
            let message = {
                time: new Date(),
                text: data.message,
                base64: undefined
            };
            if (data.file) {
                message.base64 = data.base64;
                message.text = data.file;
            }
            appendOtherHistory(username, data.from, message);

            if (selectedUser === data.from) {
                if (data.message)
                    renderResponse(message, data.from);
                else if (data.file)
                    renderImageResponse(message, data.from);
            } else {
                let element = document.getElementById("newMessage_" + data.from);
                if (element)
                    element.parentNode.removeChild(element);
                let count = incrementUnread(username, data.from);
                $('#userNameAppender_' + data.from).append('<span id="newMessage_' + data.from + '" style="color: red">+' + count + '</span>');
            }
        });
    });
    fetchAll();
}

function sendMessage(from, message) {
    appendUserHistory(from, selectedUser, message);
    stompClient.send("/app/chat/msg/" + selectedUser, {}, JSON.stringify({
        from: from,
        message: message.text
    }));
    return message;
}

function uploadFile(from, file) {
    appendUserHistory(from, selectedUser, file);
    stompClient.send("/app/chat/file/" + selectedUser, {}, JSON.stringify({
        from: from,
        file: file.text,
        base64: file.base64
    }));
}

function registration() {
    let userName = document.getElementById("userName").value;
    $.get(url + "/registration/" + userName, function (response) {
        document.cookie = "username=" + userName;
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
    renderChatroom(findChatRoom(user, selectedUser));

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
