import { Chat, Store, UserId } from "./Store";

let globalChatId = 0;

export interface Room {
    roomId: string;
    chats: Chat[]
}

export class InMemoryStore implements Store{
    private store: Map<string, Room>;

    constructor() {
        this.store = new Map<string, Room>();
    }

    initRoom(roomId: string) {
        this.store.set(roomId, {
            roomId,
            chats: []
        })
    }

    getChats(roomId: string, limit: number, offset: number) {
        const room = this.store.get(roomId);
        if(!room) {
            return [];
        }
        
        return room.chats.slice().reverse().slice(offset, (limit + offset));          
    }

    addChat(userId: UserId, name: string, roomId: string, message: string) {
        if(!this.store.get(roomId)) {
            this.initRoom(roomId);
        }
        
        const room = this.store.get(roomId);
        if(!room) {
            return;
        }

        const chat = {
            id: String(globalChatId++),
            userId, 
            name,
            message,
            upvotes: []
        }

        room.chats.push(chat);

        return chat;
    }

    upvote(userId: UserId, roomId: string, chatId: string) {
        const room = this.store.get(roomId);

        if(!room) {
            return;
        }

        const chat = room.chats.find((chat) => chat.id == chatId);

        if(chat) {
            if (chat.upvotes.find((id) => id == userId)) {
                return;
            }

            chat.upvotes.push(userId);
        }

        return chat;
    }
}
