import { connection } from "websocket";
import { OutgoingMessage, SupportedMessage } from "./messages/outgoingMessages";

interface User {
    id: string;
    name: string;
    conn: connection
}

interface Room {
    users: User[];
}

export class UserManager {
    private rooms: Map<string, Room>;
    
    constructor() {
        this.rooms = new Map<string, Room>();
    }

    initUser(roomId: string) {
        this.rooms.set(roomId, {
            users: []
        })
    }

    addUser(name: string, roomId: string, userId: string, socket: connection) {
        if(!this.rooms.get(roomId)) {
            this.initUser(roomId);
        }

        this.rooms.get(roomId)?.users.push({
            id: userId,
            name,
            conn: socket
        });
        
        socket.on('close', (reasonCode, description) => {
            console.log((new Date()) + ' Peer ' + socket.remoteAddress + ' disconnected.');
            console.log(`UserId: ${userId} disconnected`);
            this.removeUser(roomId, userId);
        });
    }

    removeUser(roomId: string, userId: string) {
        let users = this.rooms.get(roomId)?.users;
        
        if(!users) {
            return;
        }

        users = users.filter(({id}) => id !== userId);

        if(users.length != 0) {
            this.rooms.set(roomId, {
                users
            });
        }
    }

    getUser(roomId: string, userId: string): (User | null) {
        const user = this.rooms.get(roomId)?.users.find(({id}) => id == userId)
        return user ?? null;
    }

    broadcast(roomId: string, userId: string, message: OutgoingMessage) {
        const user = this.getUser(roomId, userId);
        if(!user) {
            console.error('User not found');
            return;
        }

        const room = this.rooms.get(roomId);
        if(!room) {
            console.error('Room not found');
            return;
        }

        room.users.forEach(({conn, id}) => {
            // if(id === userId) {
            //     return;
            // }
            
            conn.sendUTF(JSON.stringify(message))
        })
    }
}