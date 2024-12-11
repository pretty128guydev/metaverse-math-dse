import React from 'react';

interface Props {
  text: string;
}

const Button: React.FC<Props> = ({ text }) => {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
      {text}
    </button>
  );
};

export default Button;
