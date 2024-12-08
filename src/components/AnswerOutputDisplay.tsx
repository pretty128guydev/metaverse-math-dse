import React, { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import ProgressBar from "./ProgressBar";
import { EditableMathField, StaticMathField, addStyles } from "react-mathquill";

addStyles();

function normalizeSlashes(input: string): string {
    // Replace occurrences of double slashes with a single slash
    return input.replace(/\/{2,}/g, '/');
}

interface EvaluationsProps {
    comment: string;
    correct: string;
    step: string;
}

interface AnswerOutputDisplayProps {
    answerResponses: any;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const RenderMath: React.FC<{ content: string }> = ({ content }) => (
    <MathJax style={{ textAlign: "start" }}>{content}</MathJax>
);

const RenderEvaluation: React.FC<{ evaluations: EvaluationsProps[] }> = ({ evaluations }) => (
    <>
        {evaluations.map((evaluation, index) => (
            <div key={index} className="mb-2">
                <StaticMathField>{normalizeSlashes(evaluation.comment)}</StaticMathField>
                <StaticMathField>{normalizeSlashes(evaluation.correct)}</StaticMathField>
                <StaticMathField>{normalizeSlashes(evaluation.step)}</StaticMathField>
            </div>
        ))}
    </>
);

const RenderSteps: React.FC<{ steps: string[] }> = ({ steps }) => (
    <>
        <h3 className="text-lg font-medium mb-2">Solution Steps:</h3>
        {steps.map((step, index) => (
            <div key={index} className="mb-2">
                <StaticMathField>{normalizeSlashes(step)}</StaticMathField>
            </div>
        ))}
    </>
);

const AnswerOutputDisplay: React.FC<AnswerOutputDisplayProps> = ({ setIsLoading, isLoading, answerResponses, }) => {
    const [similarQuestion, setSetSimilarQuestion] = useState<EvaluationsProps[]>([]);
    const [edit, setEdit] = useState<boolean>(false);
    const steps = answerResponses?.steps || [];
    const finalAnswer = answerResponses?.['final_answer'];

    const onEdit = () => {
        setEdit(!edit)
    }

    const onEvaluate = async () => {
        const payload = {
            final_answer: finalAnswer,
            steps: steps
        };
        setIsLoading(true)
        try {
            const response = await fetch("http://ken6a03.pythonanywhere.com/api/solution/evaluate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                const responseText = data?.evaluation
                setSetSimilarQuestion(responseText);
            } else {
                console.error("Error:", data);
                alert(`Request failed: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Check the console for details.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    console.log(steps)
    console.log(similarQuestion)

    return (
        <div className="relative bg-gray-800 p-6 rounded-lg shadow-md mt-6 w-full max-w-6xl mb-4">
            <h2 className="text-xl font-semibold mb-4">Answer Output Display</h2>
            <div className="relative w-full h-[300px] border border-gray-600 p-4 rounded bg-gray-900 text-gray-200 overflow-auto pb-[40px]">
                {isLoading && <ProgressBar isLoading={isLoading} />}
                {!edit && !isLoading && steps.length > 0 &&
                    <div className="mb-3">
                        <RenderSteps steps={steps} />
                        <h4 className="text-lg font-medium mb-2">Final Answer:</h4>
                        <StaticMathField>{normalizeSlashes(finalAnswer)}</StaticMathField>
                    </div>
                }
            </div>
            {steps.length > 0 &&
                <div className="absolute h-[35px] w-[calc(100%-3rem)] bottom-[25px] flex justify-end bg-gray-900 w-full max-w-6xl">
                    <button onClick={onEvaluate} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 rounded shadow hover:opacity-90">
                        {"Evaluate"}
                    </button>
                </div>
            }

            <RenderEvaluation evaluations={similarQuestion} />
        </div>
    );
};

export default AnswerOutputDisplay;
