import { io } from 'socket.io-client';

// Replace with a valid JWT from your NestJS backend
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdnQGdtYWlsLmNvbSIsInN1YiI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3NDg5NTI4OTcsImV4cCI6MTc0ODk1NjQ5N30.pj42Kq3Zl-INzAm8sl7sIdw-Qr22c49KVPc3ZTl3_ys';

const socket = io('http://localhost:3005', {
  auth: {
    token: token
  },
  transports: ['websocket']
});

// Listen for connection
socket.on('connect', () => {
  console.log('✅ Connected with ID:', socket.id);
  // Optional: join a conversation
  socket.emit('joinConversation', 1, (messages: any) => {
    console.log('📦 Joined conversation 1. Previous messages:');
    console.table(messages);
  });

  // Send a message to a conversation
  socket.emit('sendMessage', {
    content: 'Hello from client',
    conversationId: 1
  }, (response: any) => {
    console.log('📤 Message sent:', response);
  });
});

// Listen for incoming messages
socket.on('newMessage', (msg: any) => {
  console.log('📨 New message received:', msg);
});

// Listen for new conversations (admins only)
socket.on('newConversation', (conv: any) => {
  console.log('🆕 New conversation started:', conv);
});

// Error handling
socket.on('connect_error', (err) => {
    console.log(err);
  console.error('❌ Connection error:', err.message);
});
