import React from "react";

interface ActionsProps {
    setApiResponses: (response: string) => void;
    setSolutionResponses: (response: string) => void;
    setIsLoading: (loading: boolean) => void;
    output: string | null;
}

const Actions: React.FC<ActionsProps> = ({ setIsLoading, setApiResponses, setSolutionResponses, output }) => {


    return (
        <div className="flex space-x-4 my-8">
            <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded shadow hover:opacity-90"
            // onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default Actions;