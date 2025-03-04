export enum SupportedMessage {
    JoinRoom = "JOIN_ROOM",
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT",
}

type MessagePayload = {
    chatId: string,
    roomId: string,
    message: string,
    name: string,
    upvotes: number,
    userId: string
}

export type OutgoingMessage = {
    type: SupportedMessage.AddChat,
    payload: MessagePayload
} | {
    type: SupportedMessage.UpdateChat,
    payload: Partial<MessagePayload>
} | {
    type: SupportedMessage.JoinRoom,
    payload: Partial<MessagePayload>
}