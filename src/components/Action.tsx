import React from 'react';

interface Props {
    setSolutionResponses: (response: any) => void;
    setSetSimilarQuestion: (response: any) => void;
    setIsLoading: (loading: boolean) => void;
    setEdit: (edit: boolean) => void;
    setEvaluation: (evaluation: any) => void;
    questionImage: string;
    answerResponse: any;
    edit: boolean;
    uploadType: string;
}


const Action: React.FC<Props> = ({ setEdit, setSetSimilarQuestion, setSolutionResponses, setIsLoading, setEvaluation, uploadType, answerResponse, edit, questionImage }) => {

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
        }
    };

    return (
        <div className="absolute flex justify-around items-center bg-[#152143] rounded-3xl m-[auto] w-[54%] left-[23%] mt-8 h-[80px] z-[10]">
            <h2 className="text-yellow-500 font-bold text-2xl">ACTION</h2>
            <div className="flex gap-4">
                <button onClick={() => setEdit(!edit)} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                    {!edit ? "EDIT" : "OK?"}
                </button>
                <button onClick={uploadType === "Answer" ? postEvaluation : handleGetSolution} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                    SUBMIT
                </button>
                <button onClick={handleGenerateQuestion} className="px-2 py-1 bg-[#6aa4a5] text-black font-bold rounded hover:bg-gray-400">
                    GENERATE QUESTION
                </button>
            </div>
        </div>
    );
};

export default Action;
