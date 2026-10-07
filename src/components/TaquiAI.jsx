import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/TaquiAI.css';

const SUGGESTIONS = [
  "Tell me about Aureza E-Commerce",
  "Explain his IntelliRAG & AI projects",
  "What are Taqui's strongest technical skills?",
  "Is he suitable for a Java Spring Boot role?",
];

/* ─── Minimal Markdown Renderer ─────────────────────────────────────── */
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  let listType = null; // 'ul' or 'ol'
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul';
      elements.push(
        <ListTag key={key++}>
          {listItems.map((li, i) => <li key={i}>{formatInline(li)}</li>)}
        </ListTag>
      );
      listItems = [];
      listType = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Unordered list: - item, * item, • item
    const ulMatch = line.match(/^\s*[-*•]\s+(.+)/);
    if (ulMatch) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(ulMatch[1]);
      continue;
    }

    // Ordered list: 1. item
    const olMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (olMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(olMatch[1]);
      continue;
    }

    flushList();

    // Headings
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={key++}>{formatInline(line.slice(5))}</h4>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{formatInline(line.slice(4))}</h3>);
    } else if (line.trim() === '') {
      // skip empty lines
    } else {
      elements.push(<p key={key++}>{formatInline(line)}</p>);
    }
  }

  flushList();
  return elements;
}

function formatInline(text) {
  // Bold: **text** or __text__
  const parts = [];
  const regex = /(\*\*|__)(.*?)\1|(`)(.*?)\3/g;
  let lastIndex = 0;
  let match;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<strong key={i++}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<code key={i++}>{match[4]}</code>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

/* ─── Main Component ────────────────────────────────────────────────── */
function TaquiAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showBubble, setShowBubble] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowBubble(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const userMessage = text.trim();
    if (!userMessage || isThinking) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';
      let hasStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'session') {
              setSessionId(data.session_id);
            } else if (data.type === 'chunk') {
              if (!hasStarted) {
                hasStarted = true;
                setIsThinking(false);
                setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
              } else {
                aiResponse += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === 'ai') {
                    updated[updated.length - 1] = {
                      ...lastMsg,
                      content: lastMsg.content + data.content,
                    };
                  }
                  return updated;
                });
              }
            } else if (data.type === 'error') {
              setIsThinking(false);
              setMessages(prev => [...prev, { role: 'error', content: data.content }]);
            } else if (data.type === 'done') {
              setIsThinking(false);
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch {
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'error',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    }
  }, [isThinking, sessionId]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  const handleSuggestionClick = useCallback((suggestion) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  return (
    <>
      {/* Floating AI Character */}
      <div
        className={`taqui-ai-trigger ${isOpen ? 'taqui-ai-trigger--hidden' : ''}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-label="Open Taqui AI chat"
        id="taqui-ai-trigger"
      >
        {showBubble && (
          <div className="taqui-ai-trigger__bubble">
            <button
              className="taqui-ai-trigger__bubble-close"
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              aria-label="Dismiss"
            >
              ✕
            </button>
            Hey! Want to know more about{' '}
            <span className="taqui-ai-trigger__bubble-highlight">Taqui</span>?
            Chat with his AI.
          </div>
        )}
        <div className="taqui-ai-trigger__avatar-wrapper">
          <div className="taqui-ai-trigger__glow" />
          <img
            src="/taqui_ai_avatar.png"
            alt="Taqui AI"
            className="taqui-ai-trigger__avatar"
            draggable="false"
          />
          <div className="taqui-ai-trigger__status" />
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`taqui-ai-overlay ${isOpen ? 'taqui-ai-overlay--open' : ''}`}
        onClick={handleClose}
      />

      {/* Chat Panel */}
      <div
        className={`taqui-ai-panel ${isOpen ? 'taqui-ai-panel--open' : ''}`}
        id="taqui-ai-panel"
      >
        {/* Header */}
        <div className="taqui-ai-header">
          <img
            src="/taqui_ai_avatar.png"
            alt="Taqui AI"
            className="taqui-ai-header__avatar"
          />
          <div className="taqui-ai-header__info">
            <h3 className="taqui-ai-header__name">
              Taqui AI
              <span className="taqui-ai-header__badge">AI</span>
            </h3>
            <p className="taqui-ai-header__status">Ask me anything about Taqui</p>
          </div>
          <button
            className="taqui-ai-header__close"
            onClick={handleClose}
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="taqui-ai-messages">
          {messages.length === 0 && !isThinking && (
            <div className="taqui-ai-welcome">
              <img
                src="/taqui_ai_avatar.png"
                alt="Taqui AI"
                className="taqui-ai-welcome__avatar"
              />
              <h3 className="taqui-ai-welcome__title">
                Hi! I'm Taqui's AI Assistant
              </h3>
              <p className="taqui-ai-welcome__text">
                Ask me anything about his skills, projects, experience, or technical background. I'm here to help recruiters learn more about Taqui.
              </p>
              <div className="taqui-ai-welcome__suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="taqui-ai-welcome__chip"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.role === 'error') {
              return (
                <div key={i} className="taqui-ai-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
                  </svg>
                  {msg.content}
                </div>
              );
            }

            return (
              <div
                key={i}
                className={`taqui-ai-msg taqui-ai-msg--${msg.role === 'user' ? 'user' : 'ai'}`}
              >
                {msg.role === 'ai' && (
                  <img
                    src="/taqui_ai_avatar.png"
                    alt="AI"
                    className="taqui-ai-msg__avatar"
                  />
                )}
                <div className="taqui-ai-msg__content">
                  {msg.role === 'ai' ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="taqui-ai-thinking">
              <img
                src="/taqui_ai_avatar.png"
                alt="Thinking"
                className="taqui-ai-thinking__avatar"
              />
              <div className="taqui-ai-thinking__dots">
                <span className="taqui-ai-thinking__dot" />
                <span className="taqui-ai-thinking__dot" />
                <span className="taqui-ai-thinking__dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="taqui-ai-input" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="taqui-ai-input__field"
            placeholder="Ask about Taqui's skills, projects..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={1000}
            disabled={isThinking}
          />
          <button
            type="submit"
            className="taqui-ai-input__send"
            disabled={!input.trim() || isThinking}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4z" /><path d="m22 2-11 11" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

export default TaquiAI;
