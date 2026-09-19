import { useParams } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
// const conversations = [
//   {
//     id: 1,
//     name: "Obi-Wan Kenobi",
//     avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
//     lastMessage: "You were the Chosen One!",
//   },
//   {
//     id: 2,
//     name: "Anakin",
//     avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
//     lastMessage: "I hate you!",
//   },
// ];

// const messages = [
//   {
//     id: 1,
//     sender: "them",
//     name: "Obi-Wan Kenobi",
//     avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
//     time: "12:45",
//     text: "You were the Chosen One!",
//     footer: "Delivered",
//   },
//   {
//     id: 2,
//     sender: "me",
//     name: "Anakin",
//     avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
//     time: "12:46",
//     text: "I hate you!",
//     footer: "Seen at 12:46",
//   },
// ];


const BASE_URL = import.meta.env.VITE_BASE_URL;
 const getConversations = async () => {
  const res = await axios.get(BASE_URL + "/chat/conversations", {
    withCredentials: true,
  });

  return res.data;
};

const Chat = () => {
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserId = loggedInUser?._id;
  const firstName = loggedInUser?.firstName;
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState("");
  const [conversations, setConversations] = useState([]);
  const socketRef = useRef(null);


  // as soon as the page load socket connection is made and joinChat event is emitted
  useEffect(() => {
    if (!loggedInUserId) return;
    const socket = createSocketConnection();
    socketRef.current = socket;
    socketRef.current.emit("joinChat", { firstName, targetUserId, loggedInUserId });
    // Listen for incoming messages from the server
    socketRef.current.on("receiveMessage", ({ sender, chatMessages }) => {

    setMessages((prev) => [
        ...prev,
        {
            _id: crypto.randomUUID(),
            sender: sender._id === loggedInUserId ? "me" : "them",
            firstName: sender.firstName,
            lastName: sender.lastName,
            photoURL: sender.photoURL,
            chatMessages,
        },
    ]);

    setConversations((prev) => {
        return prev.map((conv) =>
            String(conv.user._id) === String(targetUserId)
                ? {
                    ...conv,
                    lastMessage: chatMessages,
                }
                : conv
        );
    });

});
    return () => {
         if (socketRef.current) {
        socketRef.current.disconnect();
    }
    };
      
  }, [loggedInUserId, targetUserId, firstName ]);
  
  useEffect(() => {
     const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchConversations();
}, []);

  const  sendMessage = ()=>{
    if (!chatMessages.trim()) return; // Prevent sending empty messages
    socketRef.current.emit("sendMessages",{firstName,targetUserId,loggedInUserId,chatMessages});
    setChatMessages(""); // Clear the input field after sending the message
  }
  return (
    // Full-height shell so everything below fills the screen instead of floating in the middle
    <div className="w-full h-screen flex overflow-hidden p-3 gap-3">
      {/* LEFT SIDE — chat list */}
      <div className="w-full sm:w-[300px] flex-shrink-0 flex flex-col h-full bg-blue-950 rounded-2xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-2 p-3 border-b border-white/10 flex-shrink-0">
          <button className="flex-shrink-0">
            <label className="btn btn-circle btn-sm swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input type="checkbox" />
              {/* hamburger icon */}
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              {/* close icon */}
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

          {/* Search grows to fill the remaining width, hamburger stays put */}
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

        {/* Scrollable conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.user._id}
              className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/5 transition-colors"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                <img
                  alt={conv.user.firstName}
                  src={conv.user.photoURL}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 bg-white rounded-lg px-3 py-2">
                <div className="font-bold text-sm text-gray-800 truncate">
                  {conv.user.firstName} {conv.user.lastName}
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
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 max-w-2xl w-full mx-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${msg.sender === "me" ? "chat-end" : "chat-start"}`}
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

        {/* Composer — pinned to the bottom instead of pushed down with a fixed margin */}
        <div className="flex items-center gap-2 p-3 border-t border-white/10 flex-shrink-0 max-w-2xl w-full mx-auto">
          <input
            value={chatMessages}
            onChange={(e) => {
              setChatMessages(e.target.value);
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
