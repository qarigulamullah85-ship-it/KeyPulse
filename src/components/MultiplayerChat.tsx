import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  createdAt: any;
}

export function MultiplayerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'multiplayerChat'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(msgs.reverse());
    }, (error) => {
      console.error("Firestore Chat Error:", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    const text = newMessage;
    setNewMessage('');
    
    await addDoc(collection(db, 'multiplayerChat'), {
      text: text,
      uid: user.uid,
      displayName: user.displayName || 'Guest',
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white font-bold flex items-center justify-between">
        Global Race Chat
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const isMe = user?.uid === msg.uid;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-slate-500 mb-1">{isMe ? 'You' : msg.displayName}</span>
              <div className={`px-4 py-2 rounded-2xl max-w-[85%] break-words ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={user ? "Type a message..." : "Login to chat"}
          disabled={!user}
          className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={!user || !newMessage.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white p-2 rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
