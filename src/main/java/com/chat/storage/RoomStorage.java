package com.chat.storage;

import java.util.HashSet;
import java.util.Set;

public class RoomStorage {

    private static RoomStorage instance;
    private Set<String> rooms;

    private RoomStorage() {
        rooms = new HashSet<>();
    }

    public static synchronized RoomStorage getInstance() {
        if (instance == null) {
            instance = new RoomStorage();
        }
        return instance;
    }

    public Set<String> getRooms() {
        return rooms;
    }

    public void setRoom(String roomName) throws Exception {
        if (rooms.contains(roomName)) {
            throw new Exception("Room aready exists with roomName: " + roomName);
        }
        rooms.add(roomName);
    }
}
