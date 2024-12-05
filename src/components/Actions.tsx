import React from "react";

interface ActionsProps {
}

const Actions: React.FC<ActionsProps> = ({ }) => {
    return (
        <div className="flex space-x-4 my-8">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 rounded shadow hover:opacity-90">
                Edit
            </button>
            <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded shadow hover:opacity-90"
            >
                Submit
            </button>
            <button className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded shadow hover:opacity-90">
                Generate Question
            </button>
        </div>
    );
};

export default Actions;
