import React from 'react';
import { StaticMathField } from 'react-mathquill';
import "katex/dist/katex.min.css";import ProgressBar from './ProgressBar';
;

interface Props {
    evaluation: any;
    isLoading: boolean;
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


const CPanel: React.FC<Props> = ({ evaluation, isLoading }) => {
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
            </div>
        </div>
    );
};

export default CPanel;
