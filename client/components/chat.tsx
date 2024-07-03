"use client";

import { useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

import { Message } from "@/chat/types";

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://localhost:7186/hub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(connect);

    connect
      .start()
      .then(() => {
        connect.on("ReceiveMessage", (id, sender, content, sentTimeUtc) => {
          setMessages((prev) => [
            ...prev,
            { id, sender, content, sentTimeUtc: new Date(sentTimeUtc) },
          ]);
        });

        connect.on("MessageHistory", (messageHistory) => {
          setMessages(
            messageHistory.map((msg: Message) => ({
              ...msg,
              sentTimeUtc: new Date(msg.sentTimeUtc),
            }))
          );
        });

        connect.on("MessageRemoved", (messageId) => {
          setMessages((prev) =>
            prev.filter((message) => message.id !== messageId)
          );
        });

        connect
          .invoke("RetrieveMessageHistory")
          .catch((err) =>
            console.error("Error retrieving message history:", err)
          );
      })
      .catch((err) =>
        console.error("Error while connecting to SignalR Hub:", err)
      );

    return () => {
      if (connect) {
        connect
          .stop()
          .catch((err) =>
            console.error("Error while disconnecting from SignalR Hub:", err)
          );
        connect.off("ReceiveMessage");
        connect.off("MessageHistory");
        connect.off("MessageRemoved");
      }
    };
  }, []);

  const sendMessage = async () => {
    if (connection && newMessage.trim()) {
      await connection.send("PostMessage", newMessage);
      setNewMessage("");
    }
  };

  const removeMessage = async (id: string) => {
    if (connection) {
      await connection.send("RemoveMessage", id);
    }
  };

  const isMyMessage = (username: string) => {
    return connection && username === connection.connectionId;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex flex-col-reverse mt-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 my-2 rounded relative ${
                isMyMessage(msg.sender) ? "bg-blue-200" : "bg-gray-200"
              }`}>
              <p>{msg.content}</p>
              <p className="text-xs">{msg.sentTimeUtc.toUTCString()}</p>
              {isMyMessage(msg.sender) && (
                <button
                  className="absolute top-0 right-0 p-1 text-xs bg-red-500 text-white rounded"
                  onClick={() => removeMessage(msg.id)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-row">
        <input
          type="text"
          className="border p-2 mr-2 rounded w-[300px]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};
