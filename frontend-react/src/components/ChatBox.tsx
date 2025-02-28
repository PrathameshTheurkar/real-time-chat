import { FormEvent, useEffect, useRef, useState } from "react";

// interface Chats {
//   message: string;
//   userId: string;
//   chatId: string;
//   upvotes: number;
// }

type MessagePriority = "normal" | "medium" | "high";

// interface Message {
//   chatId: string;
//   roomId: string;
//   message: string;
//   name: string;
//   upvotes: number;
//   priority: MessagePriority;
// }
interface Message {
  id: string;
  text: string;
  name: string;
  timestamp: Date;
  upvotes: number;
  priority: MessagePriority;
}

const ChatBox = () => {
  // const [chats, setChats] = useState<Chats[]>([]);
  // const chatRef = useRef<HTMLInputElement>(null);

  // const sendMessage = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!chatRef.current?.value) {
  //     return;
  //   }

  //   const message = chatRef.current.value;
  //   console.log("Message: ", message);
  //   setChats((chats) => [
  //     ...chats,
  //     { message, userId: "1", chatId: "1", upvotes: 0 },
  //   ]);
  //   chatRef.current.value = "";
  // };

  const [messageInput, setMessageInput] = useState<string>("");

  // State for messages in all three columns
  const [messages, setMessages] = useState<Message[]>([]);

  const normalMessagesEndRef = useRef<HTMLDivElement>(null);
  const mediumMessagesEndRef = useRef<HTMLDivElement>(null);
  const highMessagesEndRef = useRef<HTMLDivElement>(null);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      name: "You", // In a real app, this would be the current user
      timestamp: new Date(),
      upvotes: 0,
      priority: "normal",
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  // Handle upvoting a message
  const handleUpvote = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message.id === messageId) {
          const newUpvotes = message.upvotes + 1;
          let newPriority: MessagePriority = message.priority;

          // Update priority based on upvotes
          if (newUpvotes >= 15) {
            newPriority = "high";
          } else if (newUpvotes >= 10) {
            newPriority = "medium";
          }

          return { ...message, upvotes: newUpvotes, priority: newPriority };
        }
        return message;
      })
    );
  };

  const scrollToBottom = (columnType: MessagePriority) => {
    if (columnType === "normal" && normalMessagesEndRef.current) {
      normalMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (columnType === "medium" && mediumMessagesEndRef.current) {
      mediumMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (columnType === "high" && highMessagesEndRef.current) {
      highMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter messages by priority
  const normalMessages = messages.filter(
    (message) => message.priority === "normal"
  );
  const mediumPriorityMessages = messages.filter(
    (message) => message.priority === "medium"
  );
  const highPriorityMessages = messages.filter(
    (message) => message.priority === "high"
  );

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    scrollToBottom("normal");
  }, [normalMessages]);

  useEffect(() => {
    scrollToBottom("medium");
  }, [mediumPriorityMessages]);

  useEffect(() => {
    scrollToBottom("high");
  }, [highPriorityMessages]);

  // useEffect(() => {
  //   console.log("Chats: ", chats);
  // }, [chats]);

  return (
    // <div className="w-1/2 h-1/2 border border-gray-400">
    //   <form action="" onSubmit={sendMessage}>
    //     <input
    //       type="text"
    //       name="inputBox"
    //       id="inputBox"
    //       ref={chatRef}
    //       className="border border-gray-300 rounded-lg p-2"
    //     />
    //     <button type="submit" className="border border-gray-300 rounded-lg p-2">
    //       Send
    //     </button>
    //   </form>
    // </div>
    <div className="w-screen flex h-screen bg-gray-100 text-black">
      {/* First column - Normal messages */}
      <div className="w-1/3 flex flex-col border-r border-gray-300 bg-white">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {normalMessages.map((message) => (
            <div key={message.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold">{message.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <button
                  onClick={() => handleUpvote(message.id)}
                  className="flex items-center text-xs text-gray-500 hover:text-blue-500"
                >
                  <span className="mr-1">↑</span>
                  <span>{message.upvotes}</span>
                </button>
              </div>
              <p className="mt-1">{message.text}</p>
            </div>
          ))}
          <div ref={normalMessagesEndRef}></div>
        </div>

        <div className="p-4 border-t border-gray-300">
          <div className="flex">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Second column - Medium priority messages */}
      <div className="w-1/3 flex flex-col border-r border-gray-300 bg-white">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">Medium Priority (10+ upvotes)</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {mediumPriorityMessages.map((message) => (
            <div key={message.id} className="mb-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold">{message.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <button
                  onClick={() => handleUpvote(message.id)}
                  className="flex items-center text-xs text-gray-500 hover:text-blue-500"
                >
                  <span className="mr-1">↑</span>
                  <span>{message.upvotes}</span>
                </button>
              </div>
              <p className="mt-1">{message.text}</p>
            </div>
          ))}
          <div ref={mediumMessagesEndRef}></div>
        </div>
      </div>

      {/* Third column - High priority messages */}
      <div className="w-1/3 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">High Priority (15+ upvotes)</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {highPriorityMessages.map((message) => (
            <div key={message.id} className="mb-4 p-3 bg-red-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold">{message.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="mr-1">↑</span>
                  <span>{message.upvotes}</span>
                </div>
              </div>
              <p className="mt-1">{message.text}</p>
            </div>
          ))}
          <div ref={highMessagesEndRef}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
