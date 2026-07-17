import { useState, useRef } from 'react';
import { BOT_RESPONSES } from '../data';

function getReply(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key)) return val;
  }
  return BOT_RESPONSES.default;
}

export default function ChatBot() {
  const [open, setOpen]     = useState(false);
  const [input, setInput]   = useState('');
  const [msgs, setMsgs]     = useState([
    { type:'bot', text:'👋 Hi! I\'m the SK TECHVERSE AI Assistant.\n\nAsk me about our services, pricing, or projects!' },
  ]);
  const endRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { type:'user', text: input };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { type:'bot', text: getReply(input) }]);
      endRef.current?.scrollIntoView({ behavior:'smooth' });
    }, 650);
  };

  return (
    <div className="chatbot-wrap">
      <div className={`chatbot-win${open ? '' : ' closed'}`}>
        {/* Header */}
        <div className="chat-header">
          <div>
            <div className="chat-title">SK AI Assistant</div>
            <div className="chat-status"><span className="chat-dot" />Online — Avg reply &lt;1 min</div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {msgs.map((m, i) => (
            <div key={i} className={`chat-msg ${m.type}`}>
              <div className="chat-bubble">{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Quick replies */}
        <div style={{ display:'flex', gap:'0.4rem', padding:'0 0.75rem', flexWrap:'wrap' }}>
          {['Services','Pricing','Contact'].map(q => (
            <button key={q} onClick={() => { setInput(q); }} style={{ fontFamily:'var(--font-ui)', fontSize:'0.7rem', padding:'0.25rem 0.6rem', background:'rgba(var(--nb-rgb),0.08)', border:'1px solid rgba(var(--nb-rgb),0.2)', borderRadius:100, color:'var(--neon-cyan)', cursor:'pointer' }}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
          />
          <button className="chat-send" onClick={send}>➤</button>
        </div>
      </div>

      <button className="chatbot-toggle" onClick={() => setOpen(!open)} title="AI Assistant">🤖</button>
    </div>
  );
}
