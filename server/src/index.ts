import {connection, server as WebSocketServer} from 'websocket';
import http from 'http';
import { IncomingMessage, SupportedMessage,  } from './messages/incomingMessages';
import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessage } from './messages/outgoingMessages';
import { InMemoryStore } from './store/InMemoryStore';
import { UserManager } from './UserManager';

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager();
const store = new InMemoryStore();

const port = 8080;

server.listen(port, function() {
    console.log((new Date()) + ` Server is listening on port ${port}`);
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
    return true;
}

wsServer.on('request', function(request) {
    console.log(`Received WebSocket request from: ${request.origin}`);

    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept("echo-protocol", request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                console.log('Incoming Message: ', JSON.parse(message.utf8Data))
                messageHandler(connection, JSON.parse(message.utf8Data))
            }catch(e) {
                console.log(e);
            }
            // console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);
        }

    });    
});

function messageHandler(ws: connection, message: IncomingMessage) {
    if(message.type === SupportedMessage.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.roomId, payload.userId, ws);

        const outgoingMessage: OutgoingMessage = {
            type: OutgoingSupportedMessage.JoinRoom,
            payload: {
                name: payload.name,
                userId: payload.userId,
                roomId: payload.roomId,
            }

        }

        userManager.broadcast(payload.roomId, payload.userId, outgoingMessage);
    }

    if(message.type === SupportedMessage.SendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if(!user){
            console.error('User not found')
            return
        }
        const chat = store.addChat(payload.userId, user.name, payload.roomId, payload.message)
        if(!chat) {
            return;
        }

        // Todo: broadcast message to all users in the room
        const outgoingMessage = {
            type: OutgoingSupportedMessage.AddChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0,
                userId: payload.userId
            } 
        }
        console.log('Outgoing Message: ', outgoingMessage) ;       
        userManager.broadcast(payload.roomId, payload.userId, outgoingMessage)

    }

    if(message.type === SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);
        //Todo: broadcast upvote message to all users in the room
        if(!chat) {
            return;
        }

        const outgoingMessage: OutgoingMessage = {
            type: OutgoingSupportedMessage.UpdateChat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upvotes.length
            }
        }

        userManager.broadcast(payload.roomId, payload.userId, outgoingMessage)
    }
}