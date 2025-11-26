import React, { useEffect, useState } from 'react';
import { FaPhone, FaVideo, FaSearch, FaTrash, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/store';
import { useNavigate, Link } from 'react-router-dom';
import { chatService } from '../services/chatService';

const ChatInterface = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]); // List of users with recent chats
  const [activeUser, setActiveUser] = useState(null); // Current chat user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const currentUserId = user?._id || user?.id;

  // if not logged in -> login page
  useEffect(() => {
    if (!user) {
      toast.error('Please login to access chat');
      navigate('/login');
    }
  }, [user, navigate]);

  // load conversations (users sorted by recent chat) + all other users
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingConversations(true);

        // Fetch both concurrently
        const [conversationsRes, usersRes] = await Promise.all([
          chatService.getConversations().catch(e => ({ data: { conversations: [] } })),
          chatService.getUsers().catch(e => ({ data: { users: [] } }))
        ]);

        const conversations = conversationsRes.data.conversations || [];
        const allUsers = usersRes.data.users || [];

        // Create a Set of user IDs already in conversations
        const existingUserIds = new Set(conversations.map(c => c.user._id));

        // Filter users not in conversations and map to conversation format
        const otherUsers = allUsers
          .filter(u => !existingUserIds.has(u._id))
          .map(u => ({
            user: u,
            lastMessage: null
          }));

        // Merge: Recent conversations first, then other users
        setConversations([...conversations, ...otherUsers]);

      } catch (err) {
        console.error(err);
        toast.error('Failed to load chat list');
      } finally {
        setLoadingConversations(false);
      }
    };

    if (user) loadData();
  }, [user]);

  // load messages with selected user
  const handleSelectUser = async (u) => {
    setActiveUser(u);
    try {
      setLoadingMessages(true);
      const res = await chatService.getMessagesWithUser(u._id);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  // send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    try {
      const res = await chatService.sendMessage(activeUser._id, newMessage.trim());
      const msg = res.data.message;
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');

      // Update conversation list to show this user at top with new message
      setConversations(prev => {
        const other = prev.filter(c => c.user._id !== activeUser._id);
        return [{
          user: activeUser,
          lastMessage: {
            text: msg.text,
            createdAt: msg.createdAt,
            isMine: true
          }
        }, ...other];
      });

    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await chatService.deleteMessage(msgId);
      setMessages(prev => prev.filter(m => m._id !== msgId));
      toast.success("Message deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const u = c.user;
    const name =
      u.firstName && u.lastName
        ? `${u.firstName} ${u.lastName}`
        : u.name || u.email || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>

        <div className="grid md:grid-cols-4 gap-6 h-[600px]">
          {/* LEFT: Users list */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold mb-4">Conversations</h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="p-4 text-center text-gray-500">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const u = c.user;
                  const name =
                    u.firstName && u.lastName
                      ? `${u.firstName} ${u.lastName}`
                      : u.name || u.email;

                  return (
                    <div
                      key={u._id}
                      onClick={() => handleSelectUser(u)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition flex items-center gap-3 ${activeUser?._id === u._id ? 'bg-blue-50' : ''
                        }`}
                    >
                      {u.profilePhoto ? (
                        <img src={u.profilePhoto} alt={name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{name}</p>
                        {c.lastMessage ? (
                          <p className="text-sm text-gray-500 truncate">
                            {c.lastMessage.isMine ? 'You: ' : ''}{c.lastMessage.text}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Start a conversation</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Chat area */}
          {activeUser ? (
            <div className="col-span-3 bg-white rounded-lg shadow-lg flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  {activeUser.profilePhoto ? (
                    <img src={activeUser.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">
                      {activeUser.firstName && activeUser.lastName
                        ? `${activeUser.firstName} ${activeUser.lastName}`
                        : activeUser.name || activeUser.email}
                    </h3>
                    <Link to={`/profile/${activeUser._id}`} className="text-xs text-blue-600 hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition">
                    <FaPhone />
                  </button>
                  <button className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition">
                    <FaVideo />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {loadingMessages ? (
                  <p className="text-center text-gray-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-400">
                    No messages yet. Say hi!
                  </p>
                ) : (
                  messages.map((msg) => {
                    const senderId = msg.sender?._id || msg.sender?.id;
                    const isMine = senderId?.toString() === currentUserId?.toString();

                    const senderName =
                      msg.sender?.firstName && msg.sender?.lastName
                        ? `${msg.sender.firstName} ${msg.sender.lastName}`
                        : msg.sender?.name || msg.sender?.email || 'User';

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-lg relative ${isMine
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                        >
                          {!isMine && <p className="text-xs font-bold mb-1 text-gray-500">{senderName}</p>}
                          <p>{msg.text}</p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <p className={`text-[10px] ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : ''}
                            </p>
                            {isMine && (
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="text-red-300 hover:text-red-100 opacity-0 group-hover:opacity-100 transition"
                                title="Delete message"
                              >
                                <FaTrash size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 font-semibold shadow-md transition transform hover:scale-105"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="col-span-3 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center text-gray-400">
              <FaUserCircle className="w-24 h-24 mb-4 opacity-20" />
              <p className="text-xl font-medium">Select a conversation</p>
              <p className="text-sm">Choose a user from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;



// import React, { useState, useEffect } from 'react';
// import { chatService } from '../services/api';
// import { FaPhone, FaVideo, FaSearch } from 'react-icons/fa';
// import { toast } from 'react-toastify';

// import { useAuthStore } from '../store/store';
// import { useNavigate } from 'react-router-dom';

// const ChatInterface = () => {
//   const { user } = useAuthStore();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (!user) {
//       toast.error('Please login to access chat');
//       navigate('/login');
//       return;
//     }
//   }, [user, navigate]);

//   const [chatRooms, setChatRooms] = React.useState([]);
//   const [activeRoom, setActiveRoom] = React.useState(null);
//   const [messages, setMessages] = React.useState([]);
//   const [newMessage, setNewMessage] = React.useState('');
//   const [isLoading, setIsLoading] = React.useState(false);

//   React.useEffect(() => {
//     if (user) fetchChatRooms();
//   }, [user]);

//   const fetchChatRooms = async () => {
//     try {
//       const response = await chatService.getUserChatRooms();
//       setChatRooms(response.data.chatRooms);
//     } catch (error) {
//       toast.error('Failed to load chat rooms');
//     }
//   };

//   const handleSelectRoom = async (room) => {
//     setActiveRoom(room);
//     try {
//       const response = await chatService.getChatMessages(room.roomId);
//       setMessages(response.data.messages);
//     } catch (error) {
//       toast.error('Failed to load messages');
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !activeRoom) return;

//     try {
//       const response = await chatService.saveMessage({
//         roomId: activeRoom.roomId,
//         message: newMessage
//       });
//       setMessages(response.data.chatRoom.messages);
//       setNewMessage('');
//     } catch (error) {
//       toast.error('Failed to send message');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-4xl font-bold mb-8">Messages</h1>

//         <div className="grid md:grid-cols-4 gap-6 h-96">
//           {/* Chat Rooms List */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
//             <div className="p-4 border-b">
//               <h2 className="text-lg font-bold mb-4">Conversations</h2>
//               <div className="relative">
//                 <FaSearch className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search chats..."
//                   className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {chatRooms.length === 0 ? (
//                 <div className="p-4 text-center text-gray-500">No conversations</div>
//               ) : (
//                 chatRooms.map((room) => (
//                   <div
//                     key={room._id}
//                     onClick={() => handleSelectRoom(room)}
//                     className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition ${
//                       activeRoom?._id === room._id ? 'bg-blue-50' : ''
//                     }`}
//                   >
//                     <p className="font-semibold">{room.roomName}</p>
//                     <p className="text-sm text-gray-500">
//                       {room.participants.length} participants
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Chat Area */}
//           {activeRoom ? (
//             <div className="col-span-3 bg-white rounded-lg shadow-lg flex flex-col">
//               {/* Header */}
//               <div className="p-4 border-b flex justify-between items-center">
//                 <h3 className="text-lg font-bold">{activeRoom.roomName}</h3>
//                 <div className="flex gap-4">
//                   <button className="text-blue-600 hover:text-blue-700">
//                     <FaPhone />
//                   </button>
//                   <button className="text-blue-600 hover:text-blue-700">
//                     <FaVideo />
//                   </button>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//                 {messages.map((msg, idx) => (
//                   <div key={idx} className={`flex ${msg.sender._id === 'currentUserId' ? 'justify-end' : 'justify-start'}`}>
//                     <div
//                       className={`max-w-xs px-4 py-2 rounded-lg ${
//                         msg.sender._id === 'currentUserId'
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-white text-gray-800'
//                       }`}
//                     >
//                       <p className="text-sm font-semibold">{msg.sender.firstName}</p>
//                       <p>{msg.message}</p>
//                       <p className="text-xs mt-1 opacity-75">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Input */}
//               <form onSubmit={handleSendMessage} className="p-4 border-t">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </form>
//             </div>
//           ) : (
//             <div className="col-span-3 bg-white rounded-lg shadow-lg flex items-center justify-center">
//               <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;
