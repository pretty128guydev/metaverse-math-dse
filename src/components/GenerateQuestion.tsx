import React, { useState, useRef, useEffect } from "react";

interface GenerateQuestionProps {
}

const GenerateQuestion: React.FC<GenerateQuestionProps> = ({
}) => {

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold mb-4">Generate Question</h2>
            <div className="flex flex-col space-y-4">
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-center"
                >
                    Generate Question
                </button>
            </div>
        </div>
    );
};

export default GenerateQuestion;
