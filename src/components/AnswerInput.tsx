import React, { useState } from "react";

const AnswerInput: React.FC = () => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileName(file ? file.name : null);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Answer Input</h2>
            <div className="flex flex-col space-y-4">
                <label
                    htmlFor="answerFile"
                    className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-center"
                >
                    Submit Answer
                </label>
                <input
                    id="answerFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {/* {fileName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selected: {fileName}
                    </p>
                )} */}
                {/* <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Submit Answer
                </button> */}
            </div>
        </div>
    );
};

export default AnswerInput;
