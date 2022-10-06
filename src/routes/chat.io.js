
import { Server } from "socket.io";
import { FileManager } from "../db/fileManager.js";
import { logger } from '../commons/logger.js'

export const chatFile = new FileManager('chat', []);

export class ChatMessage {
    constructor(user, message) {
        this.user = user;
        this.message = message;
        this.date = new Date();
    }
}

let users = [];

export const startIO = (server) => {
    const io = new Server(server);

    io.on('connection', async (channel) => {
        let channelUser = ''
        logger.info('> a user connected to chat');
        const oldChat = await chatFile.getAll()
        io.emit('set old messages', oldChat)
        io.emit('set users', users)
        
        channel.on('incoming message', async ({username, message}) => {
            logger.info('> Nuevo mensaje de ' + username)
            if(users.indexOf(username) < 0) {
                logger.info('> Nuevo usuario')
                channelUser = username
                users.push(channelUser);
                io.emit('set users', users)
                io.emit('user enter', username)
            }
            const msg = new ChatMessage(username, message)
            const newMessage = await chatFile.save(msg)
            io.emit('set message', newMessage);
            
        });
        
        channel.on('disconnect', () => {
            logger.info('> user disconnected from chat');
            if(users.indexOf(channelUser) >= 0) {
                io.emit('user leave', channelUser)
                users = users.filter(name=> name !== channelUser);
                io.emit('set users', users)
            }
        });
    });
}

const getUsers = (chat) => {
    const duplicated = chat.map(msg=> msg.user)
    return duplicated.filter((item, pos) => duplicated.indexOf(item) == pos)
}