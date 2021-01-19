package com.chat.controller;

import java.util.Set;

import com.chat.storage.RoomStorage;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class RoomsController {

    @GetMapping("/chatroom/{roomName}")
    public ResponseEntity<Void> register(@PathVariable String roomName) {
        System.out.println("handling register room request: " + roomName);
        try {
            RoomStorage.getInstance().setRoom(roomName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fetchAllRooms")
    public Set<String> fetchAll() {
        return RoomStorage.getInstance().getRooms();
    }
}
