import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);
export const useChat = () => useContext(ChatContext);

// Controls the side chat dock (messages between employer/student + career assistant)
export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('messages');
  const [to, setTo] = useState(null);

  const openChat = (nextTab = 'messages', userId = null) => { setTab(nextTab); setTo(userId); setOpen(true); };
  const closeChat = () => setOpen(false);

  return <ChatContext.Provider value={{ open, tab, setTab, to, openChat, closeChat }}>{children}</ChatContext.Provider>;
}
