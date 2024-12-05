import React from "react";
import ProgressBar from "./ProgressBar";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface OutputDisplayProps {
    output: string | null;
    isLoading: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading }) => {
    return (
        <div className="relative bg-gray-800 p-6 rounded-lg shadow-md mt-6 w-full max-w-4xl">
            <h2 className="text-xl font-semibold mb-4">Output Display</h2>
            <div className="relative w-full h-[300px] border border-gray-600 p-4 rounded bg-gray-900 text-gray-200 overflow-hidden">
                {/* Disable interactions when loading */}
                {isLoading && <ProgressBar isLoading={isLoading} />}
                <MathJaxContext>
                    <MathJax>{output ? `\\[ ${output} \\]` : "Awaiting input..."}</MathJax>
                </MathJaxContext>
            </div>
        </div >
    );
};

export default OutputDisplay;
