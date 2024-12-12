import React, { useEffect, useState } from 'react';
import { StaticMathField } from 'react-mathquill';
import "katex/dist/katex.min.css";
import ProgressBar from './ProgressBar';
import katex from "katex";
import { toast } from 'react-toastify';
;

interface Props {
    evaluation: any;
    isLoading: boolean;
    solutionResponses: any;
    uploadType: string;
}

interface EvaluationsProps {
    comment: string;
    correct: boolean;
    step: string;
}

function normalizeSlashes(input: string): string {
    if (typeof input !== 'string') {
        console.warn('normalizeSlashes expected a string but got:', input);
        return ''; // Fallback value or handle appropriately
    }
    return input.replace(/\/{2,}/g, '/');
}

const RenderEvaluation: React.FC<{ evaluations: EvaluationsProps[] }> = ({ evaluations }) => {
    if (!Array.isArray(evaluations)) {
        return <div>No evaluations available.</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {evaluations.map((evaluation, index) => (
                <div key={index}>
                    <StaticMathField style={{ color: evaluation.correct === false ? "red" : "black", }}>{normalizeSlashes(evaluation.comment)}</StaticMathField>
                    <StaticMathField style={{ color: evaluation.correct === false ? "red" : "black" }}>{normalizeSlashes(evaluation.step)}</StaticMathField>
                </div>
            ))}
        </div>
    );
};

function isValidLaTeX(latex: string): boolean {
    try {
        katex.renderToString(latex, { throwOnError: true });
        return true;
    } catch (e) {
        console.error('Invalid LaTeX:', e, "Try agian please");
        return false;
    }
}

const RenderSolutionSteps: React.FC<{ steps: string[] }> = ({ steps }) => (
    <>
        <h3 className="text-lg font-medium mb-2">Solution Steps:</h3>
        {steps.map((step, index) => (
            <div key={index} className="mb-2">
                {isValidLaTeX(normalizeSlashes(step)) ? (
                    <StaticMathField style={{ color: "black" }}>{normalizeSlashes(step)}</StaticMathField>
                ) : (
                    <p style={{ color: "red" }}>Invalid LaTeX: {step}</p>
                )}
            </div>
        ))}
    </>
);

const CPanel: React.FC<Props> = ({ evaluation, isLoading, solutionResponses, uploadType }) => {

    const [solutionFinalAnswer, setSolutionFinalAnswer] = useState<string>("");
    const [solutionSteps, setSolutionSteps] = useState<string[]>([]);

    useEffect(() => {

        const tmpsolutionFinalAnswer = solutionResponses?.solution?.['final answer'];
        const tmpsteps = solutionResponses?.solution?.steps || [];
        const normalizedSolutionFinalAnswer = normalizeSlashes(tmpsolutionFinalAnswer);
        const solutionFinalAnswerValid = isValidLaTeX(normalizedSolutionFinalAnswer);

        setSolutionFinalAnswer(normalizedSolutionFinalAnswer);
        setSolutionSteps(tmpsteps);
        if (!solutionFinalAnswerValid) {
            toast.error("An error occurred while analyzing the photo. Please try again.", { autoClose: 3000 });
        }
    }, [solutionResponses]);

    return (
        <div className="col-span-2 border-[15px] border-[#152143] rounded-2xl bg-gray-50 overflow-hidden">
            <div className='relative h-full w-full p-4'>
                {isLoading && <ProgressBar isLoading={isLoading} />}
                <h3 className="font-bold text-4xl ml-2 text-end">C</h3>
                {evaluation &&
                    <div className="mt-[50px]" style={{
                        "pointerEvents": "none"
                    }}>
                        <RenderEvaluation evaluations={evaluation || []} />
                    </div>
                }
                {uploadType === "Question" && solutionSteps.length > 0 && (
                    <div className="mb-3 mt-[50px]" style={{ pointerEvents: "none" }}>
                        <RenderSolutionSteps steps={solutionSteps} />
                        <h4 className="text-lg font-medium mb-2">Final Answer:</h4>
                        {isValidLaTeX(normalizeSlashes(solutionFinalAnswer)) ? (
                            <StaticMathField style={{ color: "black" }}>{normalizeSlashes(solutionFinalAnswer)}</StaticMathField>
                        ) : (
                            <p style={{ color: "red" }}>Invalid LaTeX: {solutionFinalAnswer}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CPanel;