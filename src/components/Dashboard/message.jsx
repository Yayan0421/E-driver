import React, { useState, useEffect, useRef, useCallback } from 'react';
import SideNavbar from './SideNavbar';
import '../../styles/messages.css';
import api from '../../api';

const Message = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Get current user from localStorage
  useEffect(() => {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      setCurrentUser(JSON.parse(userRaw));
    }
  }, []);

  // Fetch conversations callback
  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const res = await api.getConversations();
      if (Array.isArray(res)) {
        setConversations(res);
        if (res.length === 0) {
          setLoading(false);
          return;
        }
        // Auto-select first conversation if none selected
        if (selectedConversationIndex === null && res.length > 0) {
          setSelectedConversationIndex(0);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load conversations', err);
      setError('Failed to load conversations');
      setLoading(false);
    }
  }, [selectedConversationIndex]);

  // Fetch conversations on mount and auto-refresh every 5 seconds
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversationIndex !== null && conversations[selectedConversationIndex]) {
      fetchMessages(conversations[selectedConversationIndex].id);
    }
  }, [selectedConversationIndex, conversations]);

  // Auto-refresh messages every 3 seconds if a conversation is selected
  useEffect(() => {
    if (selectedConversationIndex !== null && conversations[selectedConversationIndex]) {
      const interval = setInterval(() => {
        fetchMessages(conversations[selectedConversationIndex].id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversationIndex, conversations]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (bookingId) => {
    try {
      const res = await api.getMessages(bookingId);
      if (Array.isArray(res)) {
        setMessages(res);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentUser) return;
    if (selectedConversationIndex === null) return;

    const currentBooking = conversations[selectedConversationIndex];
    if (!currentBooking) return;

    setSendingMessage(true);
    try {
      const result = await api.sendMessage(
        currentBooking.id,
        currentUser.email,
        currentUser.name,
        'driver',
        messageInput
      );

      if (result && result.success) {
        setMessageInput('');
        // Fetch updated messages immediately
        await fetchMessages(currentBooking.id);
      }
    } catch (err) {
      console.error('Failed to send message', err);
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.passengerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = selectedConversationIndex !== null ? filteredConversations[selectedConversationIndex] : null;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMessageFromDriver = (message) => {
    return message.senderType === 'passenger';
  };

  return (
    <div className="dashboard-container">
      <SideNavbar 
        userName={userName} 
        userRole={userRole}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`messages-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="messages-container">
          {/* Conversations List */}
          <div className="conversations-panel">
            <div className="panel-header">
              <h2>Messages</h2>
            </div>

            {/* Search */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Error Message */}
            {error && <div className="error-banner">{error}</div>}

            {/* Loading State */}
            {loading && <div className="loading-text">Loading conversations...</div>}

            {/* Conversations List */}
            <div className="conversations-list">
              {filteredConversations.length === 0 && !loading && (
                <p className="no-conversations">
                  {searchQuery ? 'No conversations found' : 'No active conversations yet'}
                </p>
              )}
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversationIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedConversationIndex(index)}
                >
                  <div className="conversation-avatar">👤</div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{conversation.passengerName}</h3>
                      <span className="conversation-time">{conversation.lastMessageTime || 'Now'}</span>
                    </div>
                    <p className="conversation-preview">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && <div className="unread-badge"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          {currentConversation ? (
            <div className="chat-panel">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <span className="chat-avatar">👤</span>
                  <div>
                    <h2>{currentConversation.passengerName}</h2>
                    <p className="chat-status">
                      {currentConversation.pickupAddress ? `Pickup: ${currentConversation.pickupAddress}` : 'Active now'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="no-messages">Start a conversation</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-bubble ${isMessageFromDriver(message) ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p className="message-text">{message.messageText}</p>
                        <span className="message-time">{formatTime(message.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-area">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                  className="message-input"
                  disabled={sendingMessage}
                />
                <button 
                  onClick={handleSendMessage} 
                  className="send-btn"
                  disabled={sendingMessage || !messageInput.trim()}
                >
                  {sendingMessage ? '⏳' : '➤'}
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-panel empty-state">
              <div className="empty-message">
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;