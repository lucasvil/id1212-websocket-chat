const url = 'http://localhost:8080';
let stompClient;
let selectedUser;
let messageCounter = 0;
let newMessages = new Map();

function connectToChat(userName) {
    console.log("connecting to chat...")
    let socket = new SockJS(url + '/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to: " + frame);
        stompClient.subscribe("/topic/messages/" + userName, function (response) {
            let data = JSON.parse(response.body);
            if (selectedUser === data.from) {
                if (data.message)
                    renderResponse(data.message, data.from);
                else if (data.file)
                    renderImageResponse(data.file, data.from, data.base64);
            } else {
                newMessages.set(messageCounter++,data);
                console.log(newMessages);
                let element = document.getElementById("newMessage_" + data.from);
                if(element)
                    element.parentNode.removeChild(element);
                $('#userNameAppender_' + data.from).append('<span id="newMessage_' + data.from + '" style="color: red">+' + messageCounter + '</span>');
            }
        });
    });
    fetchAll();
}

function sendMsg(from, text) {
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

function selectUser(userName) {
    console.log("selecting users: " + userName);
    selectedUser = userName;
    let isNew = document.getElementById("newMessage_" + userName) !== null;
    if (isNew) {
        let element = document.getElementById("newMessage_" + userName);
        element.parentNode.removeChild(element);
        for(let i = 0; i < messageCounter; i++) {
            if(newMessages.get(i).message){
                renderResponse(newMessages.get(i).message, newMessages.get(i).from);
            } else if(newMessages.get(i).file) {
                renderImageResponse(newMessages.get(i).file, newMessages.get(i).from, newMessages.get(i).base64);
            }
        }
    }
    messageCounter=0;
    newMessages = new Map();
    $('#selectedUserId').html('');
    $('#selectedUserId').append('Chat with ' + userName);
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
