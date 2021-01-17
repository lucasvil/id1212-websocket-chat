let $chatHistory;
let $sendButton;
let $uploadButton;
let $file;
let $textarea;
let $chatHistoryList;

function init() {
    cacheDOM();
    bindEvents();
}

function bindEvents() {
    $sendButton.on('click', addMessage.bind(this));
    $uploadButton.on('click', addFile.bind(this));
    $textarea.on('keyup', addMessageEnter.bind(this));
}

function cacheDOM() {
    $chatHistory = $('.chat-history');
    $sendButton = $('#sendBtn');
    $uploadButton = $('#uploadBtn');
    $textarea = $('#message-to-send');
    $file = $('#file');
    $chatHistoryList = $chatHistory.find('ul');
}

function renderResponse(message, username) {
    scrollToBottom();
    var templateResponse = Handlebars.compile($("#message-response-template").html());
    var contextResponse = {
        response: message.text,
        time: message.time.toLocaleString(),
        userName: username
    };
    $chatHistoryList.append(templateResponse(contextResponse));
    scrollToBottom();
}

function renderImageResponse(fname, username, enc) {
    scrollToBottom();
    var templateResponse = Handlebars.compile($("#message-image-response-template").html());
    var contextResponse = {
        response: fname,
        time: getCurrentTime(),
        userName: username,
        image: enc
    };

    setTimeout(function () {
        $chatHistoryList.append(templateResponse(contextResponse));
        scrollToBottom();
    }.bind(this), 1500);
}

function renderSend(message) {
    scrollToBottom();
    if (message.text.trim() !== '') {
        var template = Handlebars.compile($("#message-template").html());
        var context = {
            messageOutput: message.text,
            time: message.time.toLocaleString(),
            toUserName: selectedUser
        };

        $chatHistoryList.append(template(context));
        scrollToBottom();
        $textarea.val('');
    }
}

function clearHistory() {
    $chatHistoryList.remove();
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function sendFile(element) {
    let username = $('#userName').val();
    var file = element[0].files[0];
    var fname = file.name;
    getBase64(file).then(enc => {
        uploadFile(username, fname, enc);
        scrollToBottom();
        if (fname.trim() !== '') {
            var template = Handlebars.compile($("#message-image-template").html());
            var context = {
                messageOutput: fname,
                time: getCurrentTime(),
                toUserName: selectedUser,
                image: enc
            };

            $chatHistoryList.append(template(context));
            scrollToBottom();
        }
    })
}

function sendMessage(text) {
    let username = $('#userName').val();
    message = {
        time: new Date(),
        text: text,
    }
    sendMsg(username, message);
    renderSend(message);
}

function clearHistory() {
    $chatHistoryList.html('');
}

function scrollToBottom() {
    $chatHistory.scrollTop($chatHistory[0].scrollHeight);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString();
}

function addMessage() {
    sendMessage($textarea.val());
}

function addFile() {
    sendFile($file);
}

function addMessageEnter(event) {
    // enter was pressed
    if (event.keyCode === 13) {
        addMessage();
    }
}

init();

