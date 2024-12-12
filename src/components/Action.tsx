import React, { useState } from 'react';

interface Props {
    setSolutionResponses: (response: any) => void;
    setSetSimilarQuestion: (response: any) => void;
    setIsLoading: (loading: boolean) => void;
    setEdit: (edit: boolean) => void;
    setEvaluation: (evaluation: any) => void;
    setUploadType: (type: string) => void;
    setCapturedImageType: (type: string) => void;
    questionImage: string;
    answerResponse: any;
    solutionResponses: any;
    edit: boolean;
    capturedImageType: string;
    uploadType: string;
}


const Action: React.FC<Props> = ({ setCapturedImageType, setUploadType, setEdit, setSetSimilarQuestion, setSolutionResponses, setIsLoading, setEvaluation, capturedImageType, solutionResponses, uploadType, answerResponse, edit, questionImage }) => {

    const handleGetSolution = async () => {
        setIsLoading(true)
        const payload = {
            question: questionImage,
        };
        try {
            const response = await fetch("http://ken6a03.pythonanywhere.com/api/solution/solve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data);
                setSolutionResponses(data);
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
    }

    const handleGenerateQuestion = async () => {
        setIsLoading(true);
        const payload = {
            base_question: questionImage
        };
        setIsLoading(true)
        try {
            const response = await fetch("http://ken6a03.pythonanywhere.com/api/practice/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setSetSimilarQuestion(data);
                setUploadType("Answer")
                setCapturedImageType("")
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

    const postEvaluation = async () => {
        setIsLoading(true)
        const payload = {
            final_answer: answerResponse?.final_answer,
            steps: answerResponse?.steps,
        };

        try {
            const response = await fetch("http://ken6a03.pythonanywhere.com/api/solution/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                const evaluationData = data?.evaluation?.steps || [];
                setEvaluation(evaluationData);
            } else {
                console.error("API Error:", data);
                alert(`Request failed: ${data.error || "Unknown error"}`);
                setEvaluation([]);
                return null;
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("An error occurred while connecting to the server.");
            return null;
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="absolute flex justify-around items-center bg-[#152143] rounded-3xl m-[auto] w-[54%] left-[23%] mt-8 h-[80px] z-[10]">
            <h2 className="text-yellow-500 font-bold text-2xl">ACTION</h2>
            <div className="flex gap-4">
                <button onClick={() => setEdit(!edit)} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                    {!edit ? "EDIT" : "OK?"}
                </button>
                <button style={{ opacity: !capturedImageType ? "50%" : "100%", pointerEvents: !capturedImageType ? "none" : "visible" }} disabled={!capturedImageType ? true : false} onClick={uploadType === "Answer" ? postEvaluation : handleGetSolution} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                    SUBMIT
                </button>
                <button style={{ opacity: !solutionResponses ? "50%" : "100%", pointerEvents: !solutionResponses ? "none" : "visible" }} disabled={!solutionResponses ? true : false} onClick={handleGenerateQuestion} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                    SIMILAR QUESTION
                </button>
            </div>
        </div>
    );
};

export default Action;
