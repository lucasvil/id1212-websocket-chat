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

/* rendering */

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

function renderImageResponse(file, username) {
    scrollToBottom();
    var templateResponse = Handlebars.compile($("#message-image-response-template").html());
    var contextResponse = {
        response: file.text,
        time: file.time.toLocaleString(),
        userName: username,
        image: file.base64
    };

    $chatHistoryList.append(templateResponse(contextResponse));
    scrollToBottom();
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

function renderImageSend(file) {
    scrollToBottom();
    if (file.text.trim() !== '') {
        var template = Handlebars.compile($("#message-image-template").html());
        var context = {
            messageOutput: file.text,
            time: file.time.toLocaleString(),
            toUserName: selectedUser,
            image: file.base64
        };

        $chatHistoryList.append(template(context));
        scrollToBottom();
    }
}

function renderChatroom(room) {
    let sentHist = room.user.history;
    let recHist = room.other.history;
    let scount = 0;
    let rcount = 0;

    for (let i = 0; i < (sentHist.length + recHist.length); i++) {
        if (sentHist[scount] == undefined) {
            if (recHist[rcount].base64 == undefined)
                renderResponse(recHist[rcount], room.other.name);
            else
                renderImageResponse(recHist[rcount], room.other.name);
            rcount++;
        } else if (recHist[rcount] == undefined) {
            if (sentHist[scount].base64 == undefined)
                renderSend(sentHist[scount]);
            else
                renderImageSend(sentHist[scount]);
            scount++;
        } else {
            if (sentHist[scount].time < recHist[rcount].time) {
                if (sentHist[scount].base64 == undefined)
                    renderSend(sentHist[scount]);
                else
                    renderImageSend(sentHist[scount]);
                scount++;
            } else {
                if (recHist[rcount].base64 == undefined)
                    renderResponse(recHist[rcount], room.other.name);
                else
                    renderImageResponse(recHist[rcount], room.other.name)
                rcount++;
            }
        }
    }
}

function clearHistory() {
    $chatHistoryList.html('');
}

function scrollToBottom() {
    $chatHistory.scrollTop($chatHistory[0].scrollHeight);
}

// encodes image to base64.
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/* event handlers */

function handleUpload(element) {
    let username = $('#userName').val();
    var file = element[0].files[0];
    var fname = file.name;
    getBase64(file).then(enc => {
        let file = {
            time: new Date(),
            text: fname,
            base64: enc,
        };
        uploadFile(username, file);
        renderImageSend(file);
    })
}

function handleSend(text) {
    let username = $('#userName').val();
    let message = {
        time: new Date(),
        text: text,
    }
    sendMsg(username, message);
    renderSend(message);
}

function addMessage() {
    handleSend($textarea.val());
}

function addFile() {
    handleUpload($file);
}

function addMessageEnter(event) {
    if (event.keyCode === 13) {
        addMessage();
    }
}

init();

