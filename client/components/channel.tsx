"use client";

import { useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

import { Message } from "@/chat/types";

type Props = {
  channelId: string;
};

export const Channel = ({ channelId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://localhost:7186/channelHub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(connect);

    connect
      .start()
      .then(() => {
        connect.invoke("JoinChannel", channelId);

        connect.on(
          "ReceiveChannelMessage",
          (id, sender, content, sentTimeUtc) => {
            setMessages((prev) => [
              ...prev,
              { id, sender, content, sentTimeUtc: new Date(sentTimeUtc) },
            ]);
          }
        );

        connect.on("ChannelMessageHistory", (messageHistory: Message[]) => {
          setMessages(
            messageHistory.map((msg) => ({
              ...msg,
              sentTimeUtc: new Date(msg.sentTimeUtc),
            }))
          );
        });

        connect.on("ErrorMessage", (error) => {
          setErrorMessage(error);
        });
      })
      .catch((err) =>
        console.error("Error while connecting to SignalR Channel Hub:", err)
      );

    return () => {
      if (connect) {
        connect.invoke("LeaveChannel", channelId);
        connect
          .stop()
          .catch((err) =>
            console.error(
              "Error while disconnecting from SignalR Channel Hub:",
              err
            )
          );
        connect.off("ReceiveChannelMessage");
        connect.off("ChannelMessageHistory");
        connect.off("ErrorMessage");
      }
    };
  }, [channelId]);

  const sendMessage = async () => {
    if (connection && newMessage.trim()) {
      await connection.send("SendMessageToChannel", channelId, newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="p-4">
      {errorMessage && <div className="text-rose-500">{errorMessage}</div>}
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded ${
              msg.sender === connection?.connectionId
                ? "bg-blue-200"
                : "bg-gray-200"
            }`}>
            <p>{msg.content}</p>
            <p className="text-xs">{msg.sentTimeUtc.toUTCString()}</p>
          </div>
        ))}
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
