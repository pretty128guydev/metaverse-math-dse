import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import ProgressBar from "./ProgressBar";
import './OutputDisplay.css'

interface OutputDisplayProps {
    outputs: any;
    output: string | null;
    answerResponses: string | null;
    solutionResponses: any; // Adjust type to fit your data structure
    isLoading: boolean;
}

const RenderMath: React.FC<{ content: string }> = ({ content }) => (
    <MathJax style={{ textAlign: "start" }}>{content}</MathJax>
);

/**
 * Renders the steps provided in the solutionResponses.
 */
const RenderSteps: React.FC<{ steps: string[] }> = ({ steps }) => (
    <>
        <h3 className="text-lg font-medium mb-2">Solution Steps:</h3>
        {steps.map((step, index) => (
            <div key={index} className="mb-2">
                <RenderMath content={`\\[ ${step} \\]`} />
            </div>
        ))}
    </>
);


const RenderQuestions: React.FC<{ questions: string[] }> = ({ questions }) => (
    <>
        <h3 className="text-lg font-medium mb-2">Similar Questions:</h3>
        {questions.map((question, index) => (
            <div key={index} className="mb-2">
                <RenderMath content={`\\[ ${question} \\]`} />
            </div>
        ))}
    </>
);

const OutputDisplay: React.FC<OutputDisplayProps> = ({ outputs, output, isLoading, solutionResponses, answerResponses }) => {
    const steps = solutionResponses?.solution?.steps || [];
    const finalAnswer = solutionResponses?.solution?.['final answer'] || [];
    console.log(`output: `, output)
    console.log(`outputs: `, outputs)

    return (
        <MathJaxContext>
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-md mt-6 w-full max-w-6xl">
                <h2 className="text-xl font-semibold mb-4">Output Display</h2>
                <div className="relative w-full h-[300px] border border-gray-600 p-4 rounded bg-gray-900 text-gray-200 overflow-auto">
                    {isLoading && <ProgressBar isLoading={isLoading} />}
                    {output && (
                        <RenderMath content={`\\[ ${output} \\]`} />
                    )}
                    {outputs && (
                        <RenderMath content={`\\[ ${outputs} \\]`} />
                    )}
                    {answerResponses && (
                        <RenderMath content={`\\[ ${answerResponses.replace(/\n/g, '\\\\')} \\]`} />
                    )}
                    {!isLoading && steps.length > 0 &&
                        <>
                            <RenderSteps steps={steps} />
                            <h4 className="text-lg font-medium mb-2">Final Answer:</h4>
                            <RenderMath content={`\\[ ${finalAnswer} \\]`} />
                        </>
                    }
                </div>
            </div>
        </MathJaxContext>
    );
};

export default OutputDisplay;
