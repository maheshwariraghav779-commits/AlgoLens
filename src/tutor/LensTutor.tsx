import React, { useState, useRef, useEffect } from 'react';
import { Step } from '../engine/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isOffline?: boolean;
}

interface LensTutorProps {
  moduleName: string;
  algoOrOpName: string;
  timeComplexity: string;
  pseudocode: string[];
  currentStepIndex: number;
  totalSteps: number;
  currentStep?: Step;
  currentStateDescription: string;
  onQuestionAsked?: () => void;
}

const QUICK_CHIPS = [
  'Why this step?',
  'What happens next?',
  'Why is it O(n²)?',
  'Give me an analogy'
];

export const LensTutor: React.FC<LensTutorProps> = ({
  moduleName,
  algoOrOpName,
  timeComplexity,
  pseudocode,
  currentStepIndex,
  totalSteps,
  currentStep,
  currentStateDescription,
  onQuestionAsked
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I can see the step you’re on. Tap a quick question or type your own doubt.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleAsk = async (question: string) => {
    const q = question.trim();
    if (!q || isLoading) return;

    if (onQuestionAsked) {
      onQuestionAsked(); // Automatically pause playback
    }

    const userMsg: Message = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const activeLineText =
      currentStep && currentStep.line >= 0 && pseudocode[currentStep.line]
        ? pseudocode[currentStep.line].trim()
        : 'none';

    const contextPayload = `Context Information:
Module: ${moduleName}
Algorithm / Operation: ${algoOrOpName} (${timeComplexity})
Current Step: ${currentStepIndex} of ${totalSteps > 0 ? totalSteps - 1 : 0}
Current State: ${currentStateDescription}
Highlighted Pseudocode Line: ${activeLineText}
On-Screen Explanation: ${currentStep?.text || 'No step text'}
Pseudocode:
${pseudocode.join('\n')}`;

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          context: contextPayload,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: 'assistant_' + Date.now(),
        role: 'assistant',
        content: data.text || 'Step analyzed.',
        isOffline: !data.live
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      // Offline fallback
      const fallbackMsg: Message = {
        id: 'assistant_' + Date.now(),
        role: 'assistant',
        content: `(Live AI isn't available right now.) Current step: ${currentStep?.text || 'Reviewing state'}\n${algoOrOpName} runs in ${timeComplexity.replace('Time ', '')} time. Notice how the pointers and invariant shift. Try stepping with ◀ ▶| to trace the causes!`,
        isOffline: true
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="card" id="chat">
      <div className="chat-header">
        <div className="tutor-title">
          <span>🤖 Lens, your doubt-solver</span>
        </div>
        <div className="tutor-sub">
          Knows exactly which step you’re on. Ask anything, anytime.
        </div>
      </div>

      {/* Quick Chips */}
      <div className="chips">
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip}
            className="btn"
            onClick={() => handleAsk(chip)}
            disabled={isLoading}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div id="msgs">
        {messages.map(m => (
          <div
            key={m.id}
            className={`m ${m.role === 'user' ? 'u' : 'a'}`}
          >
            {m.isOffline && (
              <span className="offline-badge">Offline Tutor</span>
            )}
            <div>{m.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="m a" style={{ fontStyle: 'italic', color: 'var(--mute)' }}>
            Lens is inspecting step {currentStepIndex}…
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>

      {/* Input bar */}
      <form
        id="q"
        onSubmit={e => {
          e.preventDefault();
          handleAsk(inputValue);
        }}
      >
        <input
          id="qi"
          placeholder="Ask about this step…"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn p"
          id="send"
          disabled={isLoading || !inputValue.trim()}
          style={{ minWidth: 0, padding: '8px 16px' }}
        >
          Ask
        </button>
      </form>
    </aside>
  );
};
