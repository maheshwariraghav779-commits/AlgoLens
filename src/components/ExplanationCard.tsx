import React, { useEffect, useState } from 'react';

interface ExplanationCardProps {
  text: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ text }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Re-trigger CSS animation on text change
    setKey(prev => prev + 1);
  }, [text]);

  return (
    <div className="card">
      <div className="lbl">What’s happening</div>
      <div id="why" key={key}>
        {text || 'Ready. Press Play or step through with ▶|.'}
      </div>
    </div>
  );
};
