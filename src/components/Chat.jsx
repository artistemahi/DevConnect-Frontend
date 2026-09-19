import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getConversations = async () => {
  const res = await axios.get(BASE_URL + "/chat/conversations", {
    withCredentials: true,
  });

  return res.data;
};

const getChatMessages = async (targetUserId) => {
  const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
    withCredentials: true,
  });

  return res.data;
};

const Chat = () => {
  const loggedInUser = useSelector((store) => store.user);

  const loggedInUserId = loggedInUser?._id;
  const firstName = loggedInUser?.firstName;

  const { targetUserId } = useParams();

  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState("");
  const [conversations, setConversations] = useState([]);

  const socketRef = useRef(null);

  // Selected conversation
  const selectedConversation = conversations.find(
    (conv) => String(conv.user._id) === String(targetUserId),
  );

  // Fetch previous messages when chat is opened
  useEffect(() => {
    if (!targetUserId || !loggedInUserId) return;

    const fetchChatMessages = async () => {
      try {
        const data = await getChatMessages(targetUserId);

        const formattedMessages = data.messages.map((message) => ({
          _id: message._id,

          sender:
            String(message.sender._id) === String(loggedInUserId)
              ? "me"
              : "them",

          firstName: message.sender.firstName,
          lastName: message.sender.lastName,
          photoURL: message.sender.photoURL,

          chatMessages: message.text,

          time: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          footer: message.seenAt
            ? `Seen at ${new Date(message.seenAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : message.deliveredAt
              ? "Delivered"
              : "Sent",
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching chat messages:", err);
      }
    };

    fetchChatMessages();
  }, [targetUserId, loggedInUserId]);

  // Connect socket and join chat room
  useEffect(() => {
    if (!loggedInUserId || !targetUserId) return;

    const socket = createSocketConnection();

    socketRef.current = socket;

    socketRef.current.emit("joinChat", {
      firstName,
      targetUserId,
      loggedInUserId,
    });

    // Listen for new messages
    socketRef.current.on("receiveMessage", ({ sender, chatMessages }) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: chatMessages._id,

          sender: String(sender._id) === String(loggedInUserId) ? "me" : "them",

          firstName: sender.firstName,
          lastName: sender.lastName,
          photoURL: sender.photoURL,

          chatMessages: chatMessages.text,

          time: new Date(chatMessages.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          footer: chatMessages.deliveredAt ? "Delivered" : "Sent",
        },
      ]);

      // Update sidebar preview
      setConversations((prev) =>
        prev.map((conv) =>
          String(conv.user._id) === String(targetUserId)
            ? {
                ...conv,
                lastMessage: chatMessages.text,
                updatedAt: chatMessages.createdAt,
              }
            : conv,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [loggedInUserId, targetUserId, firstName]);

  // Fetch conversations for sidebar
  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchConversations = async () => {
      try {
        const data = await getConversations();

        setConversations(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
  }, [loggedInUserId]);

  // Send message
  const sendMessage = () => {
    if (!chatMessages.trim()) return;

    if (!socketRef.current) return;

    socketRef.current.emit("sendMessages", {
      firstName,
      targetUserId,
      loggedInUserId,
      chatMessages,
    });

    setChatMessages("");
  };

  return (
    <div className="w-full h-screen flex overflow-hidden p-3 gap-3">
      {/* LEFT SIDE — chat list */}
      <div className="w-full sm:w-[300px] flex-shrink-0 flex flex-col h-full bg-blue-950 rounded-2xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-2 p-3 border-b border-white/10 flex-shrink-0">
          <button className="flex-shrink-0">
            <label className="btn btn-circle btn-sm swap swap-rotate">
              <input type="checkbox" />

              {/* hamburger */}
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>

              {/* close */}
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
          </button>

          {/* Search */}
          <search className="flex-grow min-w-0">
            <label className="input input-sm w-full rounded-full flex items-center gap-2">
              <svg
                className="h-[1em] opacity-50 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>

              <input
                type="search"
                required
                placeholder="Search"
                className="w-full"
              />
            </label>
          </search>
        </header>

        <div className="px-3 pt-2 pb-1 text-xs font-bold opacity-60 flex-shrink-0">
          MESSAGES
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.user._id}
              onClick={() => navigate("/chat/" + conv.user._id)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                String(conv.user._id) === String(targetUserId)
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                <img
                  alt={conv.user.firstName}
                  src={conv.user.photoURL}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 bg-white rounded-lg px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-gray-800 truncate">
                    {conv.user.firstName} {conv.user.lastName}
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-400 truncate">
                  {conv.lastMessage || "No messages yet"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — active conversation */}
      <div className="flex-1 flex flex-col h-full min-w-0 rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-3 border-b border-white/10 flex-shrink-0">
          {selectedConversation && (
            <>
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={selectedConversation.user.photoURL}
                  alt={selectedConversation.user.firstName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="font-bold text-sm">
                  {selectedConversation.user.firstName}{" "}
                  {selectedConversation.user.lastName}
                </div>

                <div className="text-xs opacity-50">Offline</div>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 max-w-2xl w-full mx-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${
                msg.sender === "me" ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-6 rounded-full overflow-hidden">
                  <img
                    alt={msg.firstName}
                    src={msg.photoURL}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="chat-header text-xs">
                {msg.firstName}

                <time className="text-[10px] opacity-50 ml-1">{msg.time}</time>
              </div>

              <div className="chat-bubble rounded-2xl text-sm max-w-xs">
                {msg.chatMessages}
              </div>

              <div className="chat-footer text-[10px] opacity-50">
                {msg.footer}
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="flex items-center gap-2 p-3 border-t border-white/10 flex-shrink-0 max-w-2xl w-full mx-auto">
          <input
            value={chatMessages}
            onChange={(e) => {
              setChatMessages(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type here..."
            className="bg-white text-black w-full rounded-full px-4 py-2 text-sm outline-none"
          />

          <button
            className="bg-blue-500 px-4 py-2 text-sm font-bold hover:bg-blue-800 rounded-full flex-shrink-0 transition-colors"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
