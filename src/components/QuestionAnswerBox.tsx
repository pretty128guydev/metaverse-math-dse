import React from 'react';

interface Props {
  label: string;
  id: string;
}

const QuestionAnswerBox: React.FC<Props> = ({ label, id }) => {
  return (
    <div>
      <h2 className="text-lg font-bold">{label}</h2>
      <div className="border-2 border-blue-600 rounded-lg p-4 bg-white shadow-md">
        <p className="text-xl font-bold">{id}</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">
          Upload
        </button>
      </div>
    </div>
  );
};

export default QuestionAnswerBox;
