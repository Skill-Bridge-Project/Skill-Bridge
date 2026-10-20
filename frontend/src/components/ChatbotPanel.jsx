import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { FAQ, GREETING, findAnswer } from '../lib/chatbotData';

export default function ChatbotPanel({ compact = false }) {
  const [msgs, setMsgs] = useState([{ from: 'bot', text: GREETING }]);
  const [text, setText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const ask = (question) => {
    if (!question.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text: question }, { from: 'bot', text: findAnswer(question) }]);
    setText('');
  };
  const chips = showAll ? FAQ : FAQ.slice(0, 6);

  return (
    <div className={`flex flex-col ${compact ? 'h-full' : 'panel h-[34rem]'}`}>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${m.from === 'me' ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="border-t border-base-300 p-3">
        <p className="mb-2 text-xs muted">Suggested questions</p>
        <div className="mb-3 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
          {chips.map((f) => (
            <button key={f.q} onClick={() => ask(f.q)} className="rounded-md border border-base-300 px-2 py-1 text-left text-xs hover:bg-base-200">{f.q}</button>
          ))}
          <button onClick={() => setShowAll(!showAll)} className="px-2 py-1 text-xs text-primary hover:underline">{showAll ? 'Show fewer' : 'Show all questions'}</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex gap-2">
          <input className="input input-bordered input-sm h-10 flex-1" placeholder="Type your question" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn btn-primary btn-sm h-10" aria-label="Send"><Send className="size-4" /></button>
        </form>
      </div>
    </div>
  );
}
