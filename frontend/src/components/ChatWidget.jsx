import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ArrowUp, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import { EASE } from './ui/motion';

const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const GREETING = {
  sender: 'bot',
  text: "Hi! I'm Myaau, your pet care assistant. Ask me about food, grooming, training or health.",
  time: now(),
};

const SUGGESTIONS = [
  'What should I feed a puppy?',
  'How often should I groom my cat?',
  'My dog keeps scratching',
];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const send = async (text) => {
    const message = (text ?? draft).trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: message, time: now() }]);
    setDraft('');
    setLoading(true);

    try {
      // Hits /api/chatbot -- Gemini when a key is set, keyword replies otherwise
      const history = messages.slice(-6).map((m) => ({ role: m.sender, text: m.text }));
      const reply = await apiService.chatWithBot(message, history);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply, time: now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I couldn't reach the server just now. Please try again, or contact us at support@petcarehub.com.",
          time: now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
            className="w-[min(22rem,calc(100vw-2.5rem))] h-[27rem] rounded-3xl bg-cream border border-hairline shadow-lift overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-blush-50/60 shrink-0">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-blush-200 text-blush-600">
                <Sparkles size={16} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink leading-tight">Myaau</p>
                <p className="text-xs text-ink-mute">Pet care assistant</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid place-items-center w-8 h-8 rounded-full text-ink-soft hover:bg-blush-100 transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scrollbar px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={`flex ${m.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.sender === 'bot'
                        ? 'bg-mist text-ink rounded-2xl rounded-bl-md'
                        : 'bg-ink text-cream rounded-2xl rounded-br-md'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-mist rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: d }}
                        className="w-1.5 h-1.5 rounded-full bg-blush-400"
                      />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-hairline text-ink-soft hover:border-blush-300 hover:bg-blush-50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-hairline shrink-0">
              <div className="flex items-center gap-2 bg-mist rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-blush-300 transition-shadow">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask about your pet..."
                  maxLength={500}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-mute outline-none min-w-0"
                />
                <motion.button
                  onClick={() => send()}
                  disabled={!draft.trim() || loading}
                  whileTap={{ scale: 0.9 }}
                  className="grid place-items-center w-8 h-8 rounded-full bg-ink text-cream disabled:opacity-30 disabled:pointer-events-none shrink-0"
                  aria-label="Send message"
                >
                  <ArrowUp size={15} strokeWidth={2.5} />
                </motion.button>
              </div>
              <p className="text-[0.68rem] text-ink-mute text-center mt-2">
                Pet health, breeds, food, grooming &amp; our services
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="grid place-items-center w-14 h-14 rounded-full bg-ink text-cream shadow-lift"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'x' : 'chat'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={21} /> : <MessageCircle size={21} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatWidget;
