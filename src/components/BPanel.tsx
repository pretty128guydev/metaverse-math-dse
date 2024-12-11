import React, { useEffect, useState } from 'react';
import { EditableMathField, StaticMathField, addStyles } from "react-mathquill";
import ProgressBar from "./ProgressBar";
import katex from "katex";
import "katex/dist/katex.min.css";
import { toast } from 'react-toastify';

interface Props {
    questionImage: any;
    isLoading: boolean;
    solutionResponses: any;
    answerResponse: any;
    similarQuestion: any;
    setIsLoading: (loading: boolean) => void;
    setQuestionImage: (response: string) => void;
    edit: boolean;
    uploadType: string;
    setAnswerResponse: (response: any) => void;
}

addStyles();

// Normalize LaTeX and validate its correctness
function normalizeSlashes(input: string): string {
    if (typeof input !== 'string') {
        console.warn('normalizeSlashes expected a string but got:', input);
        return ''; // Fallback value or handle appropriately
    }

    // Remove \left and \right
    const withoutLeftRight = input.replace(/\\left|\\right/g, '');

    // Normalize multiple consecutive slashes
    const normalizedSlashes = withoutLeftRight.replace(/\/{2,}/g, '/');

    // Ensure valid LaTeX for fractions
    const consistentFractions = normalizedSlashes.replace(/\\frac{([^}]*)}{([^}]*)}/g, (_, numerator, denominator) => {
        return `\\frac{${numerator}}{${denominator}}`;
    });

    // Replace parentheses formatted as \( and \) with normal parentheses
    const finalNormalized = consistentFractions.replace(/\\\(|\\\)/g, (match) => {
        return match === '\\(' ? '(' : ')';
    });

    return finalNormalized.trim();
}

// Validate LaTeX input using KaTeX
function isValidLaTeX(latex: string): boolean {
    try {
        katex.renderToString(latex, { throwOnError: true });
        return true;
    } catch (e) {
        console.error('Invalid LaTeX:', e, "Try agian please");
        return false;
    }
}
const RenderSteps: React.FC<{ steps: string[], editMode: boolean, onEdit: (index: number, newStep: string) => void }> = ({ steps, editMode, onEdit }) => (
    <>
        <h3 className="text-lg font-medium mb-2">Solution Steps:</h3>
        {steps.map((step, index) => (
            <div key={index} className="mb-2">
                {editMode ? (
                    <EditableMathField
                        style={{ color: "black" }}
                        latex={step}
                        onChange={(mathField) => onEdit(index, mathField.latex())}
                    />
                ) : isValidLaTeX(normalizeSlashes(step)) ? (
                    <StaticMathField style={{ color: "black", pointerEvents: "none" }}>{normalizeSlashes(step)}</StaticMathField>
                ) : (
                    <p style={{ color: "red" }}>Invalid LaTeX: {step}</p>
                )}
            </div>
        ))}
    </>
);

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


const BPanel: React.FC<Props> = ({ answerResponse, similarQuestion, questionImage, edit, uploadType, setQuestionImage, setAnswerResponse, isLoading, solutionResponses }) => {
    const [mainQuestion, setMainQuestion] = useState<string>("");
    const [solutionFinalAnswer, setSolutionFinalAnswer] = useState<string>("");
    const [generatedQuestion, setGeneratedQuestion] = useState<string>("");
    const [solutionSteps, setSolutionSteps] = useState<string[]>([]);
    const [answerSteps, setAnswerSteps] = useState<string[]>([]);
    const [finalAnswer, setFinalAnswer] = useState<string>("");

    const handleStepEdit = (index: number, newStep: string) => {
        const updatedSteps = [...answerResponse?.steps];
        updatedSteps[index] = newStep;
        setSolutionSteps(updatedSteps);
        setAnswerResponse({ ...answerResponse, steps: updatedSteps });
    };

    const handleFinalAnswerEdit = (newAnswer: string) => {
        setFinalAnswer(newAnswer); // Update final answer in the state
        setAnswerResponse({ ...answerResponse, final_answer: newAnswer }); // Update answerResponse with new final answer
    };


    useEffect(() => {
        console.log("Editing:", edit);
        console.log("Current questionImage:", questionImage);

        const tmpsolutionFinalAnswer = solutionResponses?.solution?.['final answer'];
        const tmpsteps = solutionResponses?.solution?.steps || [];
        const tmpgeneratedQuestion = similarQuestion?.questions || "";
        const tmpmainquestion = questionImage || "";
        const tmpanswerSteps = answerResponse?.steps || [];
        const tmpfinalAnswer = answerResponse?.final_answer;

        // Normalize and validate the LaTeX inputs
        const normalizedMainQuestion = normalizeSlashes(tmpmainquestion);
        const normalizedFinalAnswer = normalizeSlashes(tmpfinalAnswer);
        const normalizedSolutionFinalAnswer = normalizeSlashes(tmpsolutionFinalAnswer);

        console.log("normalizedMainQuestion:", normalizedMainQuestion);
        console.log("normalizedSolutionFinalAnswer:", normalizedSolutionFinalAnswer);

        const mainQuestionValid = isValidLaTeX(normalizedMainQuestion);
        const finalAnswerValid = isValidLaTeX(normalizedFinalAnswer);
        const solutionFinalAnswerValid = isValidLaTeX(normalizedSolutionFinalAnswer);

        if (!mainQuestionValid) {
            toast.error("An error occurred while analyzing the photo. Please try again.", { autoClose: 3000 });
        }

        if (!finalAnswerValid) {
            toast.error("An error occurred while analyzing the photo. Please try again.", { autoClose: 3000 });
        }

        if (!solutionFinalAnswerValid) {
            toast.error("An error occurred while analyzing the photo. Please try again.", { autoClose: 3000 });
        }

        // Update state
        setMainQuestion(normalizedMainQuestion);
        setAnswerSteps(tmpanswerSteps);
        setSolutionFinalAnswer(normalizedSolutionFinalAnswer);
        setFinalAnswer(normalizedFinalAnswer);
        setSolutionSteps(tmpsteps);
        setGeneratedQuestion(tmpgeneratedQuestion);

        console.log(`mainquestion :`, tmpmainquestion);
        console.log(`normalized:  `, normalizedMainQuestion);
        console.log(tmpanswerSteps);
        console.log(edit)
    }, [questionImage, solutionResponses, similarQuestion, answerResponse, edit]);


    return (
        <div className="col-span-1 border-[15px] border-[#152143] rounded-2xl bg-gray-50 overflow-hidden">
            <div className='relative h-full w-full p-4'>
                {isLoading && <ProgressBar isLoading={isLoading} />}
                <h3 className="text-start font-bold text-4xl mr-2">B</h3>
                {uploadType === "Question" && !generatedQuestion && mainQuestion && edit && (
                    <EditableMathField
                        style={{ marginTop: "50px", color: 'black' }}
                        latex={mainQuestion}
                        onChange={(mathField) => {
                            console.log("Updated LaTeX:", mathField.latex());
                            setQuestionImage(mathField.latex());
                        }}
                    />
                )}
                {!generatedQuestion && !edit && mainQuestion && (
                    <div className="mt-[50px] text-black" style={{ pointerEvents: "none" }}>
                        {isValidLaTeX(normalizeSlashes(mainQuestion)) ? (
                            <StaticMathField style={{ color: "black" }}>{normalizeSlashes(mainQuestion)}</StaticMathField>
                        ) : (
                            <p style={{ color: "red" }}>Invalid LaTeX: {mainQuestion}</p>
                        )}
                    </div>
                )}
                {uploadType === "Question" && !generatedQuestion && solutionSteps.length > 0 && (
                    <div className="mb-3" style={{ pointerEvents: "none" }}>
                        <RenderSolutionSteps steps={solutionSteps} />
                        <h4 className="text-lg font-medium mb-2">Final Answer:</h4>
                        {isValidLaTeX(normalizeSlashes(solutionFinalAnswer)) ? (
                            <StaticMathField style={{ color: "black" }}>{normalizeSlashes(solutionFinalAnswer)}</StaticMathField>
                        ) : (
                            <p style={{ color: "red" }}>Invalid LaTeX: {solutionFinalAnswer}</p>
                        )}
                    </div>
                )}
                {generatedQuestion && (
                    <div className="mt-[50px]" style={{ pointerEvents: "none" }}>
                        <h4 className="text-lg font-medium">Similar Question:</h4>
                        {isValidLaTeX(normalizeSlashes(generatedQuestion)) ? (
                            <StaticMathField style={{ color: "black" }}>{normalizeSlashes(generatedQuestion)}</StaticMathField>
                        ) : (
                            <p style={{ color: "red" }}>Invalid LaTeX: {generatedQuestion}</p>
                        )}
                    </div>
                )}
                {!isLoading && answerSteps.length > 0 && (
                    <div className="">
                        <RenderSteps
                            steps={answerSteps}
                            editMode={edit}  // Pass edit mode to RenderSteps
                            onEdit={handleStepEdit}  // Pass onEdit function to handle step editing
                        />
                        {uploadType === "Answer" && edit ? (
                            <div>
                                <h4 className="text-black text-lg font-medium">Final Answer:</h4>
                                <EditableMathField
                                    latex={finalAnswer}
                                    onChange={(mathField) => {
                                        handleFinalAnswerEdit(mathField.latex());
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{ pointerEvents: "none" }}>
                                <h4 className="text-black text-lg font-medium">Final Answer:</h4>
                                {isValidLaTeX(normalizeSlashes(finalAnswer)) ? (
                                    <StaticMathField>{normalizeSlashes(finalAnswer)}</StaticMathField>
                                ) : (
                                    <p style={{ color: "red" }}>Invalid LaTeX: {finalAnswer}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BPanel;
