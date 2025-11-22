import React, { useState, useEffect } from 'react';
import { chatService } from '../services/api';
import { FaPhone, FaVideo, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

const ChatInterface = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      toast.error('Please login to access chat');
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const [chatRooms, setChatRooms] = React.useState([]);
  const [activeRoom, setActiveRoom] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) fetchChatRooms();
  }, [user]);

  const fetchChatRooms = async () => {
    try {
      const response = await chatService.getUserChatRooms();
      setChatRooms(response.data.chatRooms);
    } catch (error) {
      toast.error('Failed to load chat rooms');
    }
  };

  const handleSelectRoom = async (room) => {
    setActiveRoom(room);
    try {
      const response = await chatService.getChatMessages(room.roomId);
      setMessages(response.data.messages);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    try {
      const response = await chatService.saveMessage({
        roomId: activeRoom.roomId,
        message: newMessage
      });
      setMessages(response.data.chatRoom.messages);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>

        <div className="grid md:grid-cols-4 gap-6 h-96">
          {/* Chat Rooms List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold mb-4">Conversations</h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chatRooms.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations</div>
              ) : (
                chatRooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => handleSelectRoom(room)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition ${
                      activeRoom?._id === room._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="font-semibold">{room.roomName}</p>
                    <p className="text-sm text-gray-500">
                      {room.participants.length} participants
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {activeRoom ? (
            <div className="col-span-3 bg-white rounded-lg shadow-lg flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">{activeRoom.roomName}</h3>
                <div className="flex gap-4">
                  <button className="text-blue-600 hover:text-blue-700">
                    <FaPhone />
                  </button>
                  <button className="text-blue-600 hover:text-blue-700">
                    <FaVideo />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender._id === 'currentUserId' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender._id === 'currentUserId'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <p className="text-sm font-semibold">{msg.sender.firstName}</p>
                      <p>{msg.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="col-span-3 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
