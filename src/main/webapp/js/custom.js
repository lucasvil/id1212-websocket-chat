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

function render(message, userName) {
    scrollToBottom();
    // responses
    var templateResponse = Handlebars.compile($("#message-response-template").html());
    var contextResponse = {
        response: message,
        time: getCurrentTime(),
        userName: userName
    };

    setTimeout(function () {
        $chatHistoryList.append(templateResponse(contextResponse));
        scrollToBottom();
    }.bind(this), 1500);
}

function sendMessage(message) {
    let username = $('#userName').val();
    console.log(username)
    sendMsg(username, message);
    scrollToBottom();
    if (message.trim() !== '') {
        var template = Handlebars.compile($("#message-template").html());
        var context = {
            messageOutput: message,
            time: getCurrentTime(),
            toUserName: selectedUser
        };

        $chatHistoryList.append(template(context));
        scrollToBottom();
        $textarea.val('');
    }
}

function scrollToBottom() {
    $chatHistory.scrollTop($chatHistory[0].scrollHeight);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
}

function addMessage() {
    sendMessage($textarea.val());
}

function addFile() {
    sendFile($file);
}

function sendFile(path) {
    var template = Handlebars.compile($("#message-template").html());
    var username = $('#userName').val();
    //var f = new File([""], path, { type: "image/png, image/jpeg" });
    console.log(path);
    uploadFile(username, 'FILE');
    scrollToBottom();
    var context = {
        messageOutput: 'FILE',
        time: getCurrentTime(),
        toUserName: selectedUser
    };

    $chatHistoryList.append(template(context));
    scrollToBottom();
}

function addMessageEnter(event) {
    // enter was pressed
    if (event.keyCode === 13) {
        addMessage();
    }
}

init();

