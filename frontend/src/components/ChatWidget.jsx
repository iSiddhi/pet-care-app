import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, X, ArrowUp, Cat, Maximize2, Minimize2 } from 'lucide-react';
import { apiService } from '../services/api';
import { playMeow, primeMeow } from '../utils/meow';
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
  'Do you have rabbits?',
];

/**
 * On phones the software keyboard covers the bottom of the layout viewport
 * without resizing it, so a `fixed bottom-0` panel ends up behind the keys.
 * visualViewport reports what is actually visible; we lift by the difference.
 */
const useKeyboardInset = () => {
  const [inset, setInset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window === 'undefined' ? 800 : window.innerHeight
  );

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;

    const update = () => {
      const covered = window.innerHeight - vv.height - vv.offsetTop;
      setInset(Math.max(0, Math.round(covered)));
      setViewportHeight(vv.height);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return { inset, viewportHeight };
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnseen, setHasUnseen] = useState(true);
  const greeted = useRef(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const { inset, viewportHeight } = useKeyboardInset();

  const panelHeight = expanded
    ? Math.max(320, Math.min(680, viewportHeight - 112))
    : Math.max(240, Math.min(432, viewportHeight - 132));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, expanded]);

  useEffect(() => { primeMeow(); }, []);

  useEffect(() => {
    if (!open) return;
    setHasUnseen(false);
    setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const toggle = () => {
    // Only the first open says hello — after that it would just be noise
    if (!open && !greeted.current) {
      greeted.current = true;
      playMeow();
    }
    setOpen((v) => !v);
  };

  // Esc closes, or un-maximises first
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (expanded) setExpanded(false);
      else setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, expanded]);

  const send = useCallback(
    async (text) => {
      const message = (text ?? draft).trim();
      if (!message || loading) return;

      setMessages((prev) => [...prev, { sender: 'user', text: message, time: now() }]);
      setDraft('');
      setLoading(true);

      try {
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
    },
    [draft, loading, messages]
  );

  return (
    <div
      style={{ bottom: `calc(1.25rem + ${inset}px)` }}
      className="fixed right-5 z-50 flex flex-col items-end gap-3 transition-[bottom] duration-200"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: EASE }}
            style={{ transformOrigin: 'bottom right', height: panelHeight }}
            className={`rounded-2xl bg-cream border border-hairline shadow-lift overflow-hidden flex flex-col
              ${expanded
                ? 'w-[min(40rem,calc(100vw-2.5rem))]'
                : 'w-[min(22rem,calc(100vw-2.5rem))]'}`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-blush-100/70 shrink-0">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-blush-200 text-blush-600">
                <Cat size={16} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink leading-tight">Myaau</p>
                <p className="text-xs text-ink-mute flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                  Pet care assistant
                </p>
              </div>

              <button
                onClick={() => setExpanded((v) => !v)}
                className="hidden sm:grid place-items-center w-8 h-8 rounded-full text-ink-soft hover:bg-cream transition-colors"
                aria-label={expanded ? 'Shrink chat' : 'Expand chat'}
                title={expanded ? 'Shrink' : 'Expand'}
              >
                {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              <button
                onClick={() => { setOpen(false); setExpanded(false); }}
                className="grid place-items-center w-8 h-8 rounded-full text-ink-soft hover:bg-cream transition-colors"
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
                  transition={{ duration: 0.22, ease: EASE }}
                  className={`flex ${m.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.sender === 'bot'
                        ? 'bg-mist text-ink rounded-2xl rounded-bl-md'
                        : 'bg-blush-500 text-white rounded-2xl rounded-br-md'
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

              {/* Prompts stay available until the conversation gets going */}
              {messages.length <= 3 && !loading && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-hairline text-ink-soft hover:border-blush-300 hover:bg-blush-50 hover:text-blush-600 transition-colors"
                    >
                      {q}
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
                  className="grid place-items-center w-8 h-8 rounded-full bg-blush-500 text-white disabled:opacity-30 disabled:pointer-events-none shrink-0"
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
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative grid place-items-center w-14 h-14 rounded-full bg-blush-500 text-white shadow-lift"
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          {/* One-time ring so the launcher is noticed without nagging */}
          {!open && hasUnseen && (
            <motion.span
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 1.8, repeat: 3, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-blush-400"
            />
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'x' : 'paw'}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ duration: 0.16 }}
              className="relative"
            >
              {open ? <X size={21} /> : <PawPrint size={23} strokeWidth={2.1} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
    </div>
  );
};

export default ChatWidget;
