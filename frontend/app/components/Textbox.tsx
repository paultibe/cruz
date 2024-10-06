import React, { useState } from 'react';

interface TextboxProps {
  onSave: (text: string) => void;
}

const Textbox: React.FC<TextboxProps> = ({ onSave }) => {
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave(text);
      setText('');
    }
  };

  return (
    <input
      type="text"
      value={text}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      className="w-[299px] h-[54px] border border-orange-500 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
      placeholder="Type and press Enter to save"
    />
  );
};

export default Textbox;