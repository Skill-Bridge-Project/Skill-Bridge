import { X } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import MessagesPanel from './MessagesPanel';
import ChatbotPanel from './ChatbotPanel';

// Side chat: direct messages between employers and students, and the career assistant
export default function ChatDock() {
  const { open, tab, setTab, to, closeChat } = useChat();
  if (!open) return null;
  return (
    <aside className="no-print fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-base-300 bg-base-100 shadow-xl sm:w-[380px]" aria-label="Chat">
      <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
        <div role="tablist" className="tabs tabs-boxed bg-base-200">
          <button role="tab" className={`tab ${tab === 'messages' ? 'tab-active' : ''}`} onClick={() => setTab('messages')}>Messages</button>
          <button role="tab" className={`tab ${tab === 'assistant' ? 'tab-active' : ''}`} onClick={() => setTab('assistant')}>Assistant</button>
        </div>
        <button className="btn btn-ghost btn-sm btn-square" onClick={closeChat} aria-label="Close chat"><X className="size-4" /></button>
      </div>
      <div className="min-h-0 flex-1">
        {tab === 'messages' ? <MessagesPanel compact initialTo={to} /> : <ChatbotPanel compact />}
      </div>
    </aside>
  );
}
