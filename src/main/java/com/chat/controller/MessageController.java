package com.chat.controller;

import com.chat.model.FileModel;
import com.chat.model.MessageModel;
import com.chat.storage.UserStorage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat/msg/{to}")
    public void sendMessage(@DestinationVariable String to, MessageModel message, byte[] base64) {
        System.out.println("handling send message: " + message + " to: " + to);
        boolean isExists = UserStorage.getInstance().getUsers().contains(to);
        if (isExists) {
            simpMessagingTemplate.convertAndSend("/topic/messages/" + to, message);
        }
    }

    @MessageMapping("/chat/file/{to}")
    public void sendFile(@DestinationVariable String to, FileModel file, byte[] base64) {
        System.out.println("handling send file to: " + to);
        System.out.println(base64.length);
        file.setBase64(base64);
        boolean isExists = UserStorage.getInstance().getUsers().contains(to);
        if (isExists) {
            simpMessagingTemplate.convertAndSend("/topic/messages/" + to, file);
        }
    }
}
