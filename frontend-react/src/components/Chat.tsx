import { FormEvent, useEffect, useRef, useState } from "react";

interface Chats {
  message: string;
  userId: string;
  chatId: string;
  upvotes: number;
}

const Chat = () => {
  const [chats, setChats] = useState<Chats[]>([]);
  const chatRef = useRef<HTMLInputElement>(null);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!chatRef.current?.value) {
      return;
    }

    const message = chatRef.current.value;
    console.log("Message: ", message);
    setChats((chats) => [
      ...chats,
      { message, userId: "1", chatId: "1", upvotes: 0 },
    ]);
    chatRef.current.value = "";
  };

  useEffect(() => {
    console.log("Chats: ", chats);
  }, [chats]);

  return (
    <>
      <form action="" onSubmit={sendMessage}>
        <input
          type="text"
          name="inputBox"
          id="inputBox"
          ref={chatRef}
          className="border border-gray-300 rounded-lg p-2"
        />
        <button type="submit" className="border border-gray-300 rounded-lg p-2">
          Send
        </button>
      </form>
    </>
  );
};

export default Chat;
