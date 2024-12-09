import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { EditableMathField, StaticMathField, addStyles } from "react-mathquill";
import Webcam from "react-webcam";
import axios from "axios";

addStyles();

function normalizeSlashes(input: string): string {
    if (typeof input !== 'string') {
        console.warn('normalizeSlashes expected a string but got:', input);
        return ''; // Fallback value or handle appropriately
    }
    return input.replace(/\/{2,}/g, '/');
}


interface OutputDisplayProps {
    outputs: any;
    output: string | null;
    isLoading: boolean;
    solutionResponses: any;
    setIsLoading: (loading: boolean) => void;
    setApiResponse: (response: string) => void;
    setSolutionResponses: (response: string) => void;
}

interface EvaluationsProps {
    comment: string;
    correct: boolean;
    step: string;
}

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

const RenderEvaluation: React.FC<{ evaluations: EvaluationsProps[] }> = ({ evaluations }) => {
    if (!Array.isArray(evaluations)) {
        return <div>No evaluations available.</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {evaluations.map((evaluation, index) => (
                <>
                    <StaticMathField style={{ color: evaluation.correct === false ? "red" : "white", }}>{normalizeSlashes(evaluation.comment)}</StaticMathField>
                    <StaticMathField style={{ color: evaluation.correct === false ? "red" : "white" }}>{normalizeSlashes(evaluation.step)}</StaticMathField>
                </>
            ))}
        </div>
    );
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, setIsLoading, setApiResponse, solutionResponses, setSolutionResponses }) => {
    const [similarQuestion, setSetSimilarQuestion] = useState<string>("");
    const [evaluation, setEvaluation] = useState<EvaluationsProps[]>([]);
    const [edit, setEdit] = useState<boolean>(false);
    const [answerResponses, setAnswerResponse] = useState<any>(null);
    const [mainQuestion, setMainQuestion] = useState<string | null>(output || null);

    const [answerNotification, setAnswerNotification] = useState<string | null>(null);
    const finalAnswer = solutionResponses?.solution?.['final answer'];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [photoMode, setPhotoMode] = useState(false);
    const [cameraAccessible, setCameraAccessible] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const steps = solutionResponses?.solution?.steps || [];
    const answerSteps = answerResponses?.steps || [];
    const finalAnswer2 = answerResponses?.final_answer;

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(() => {
                setCameraAccessible(true);
            })
            .catch(() => {
                setCameraAccessible(false);
            });
        if (output) {
            setMainQuestion(output);
        }
    }, [output]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [dropdownOpen]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const result = reader.result as string;
                if (result) {
                    compressImage(result, (compressedBase64) => {
                        handleSubmit(compressedBase64);
                    });
                } else {
                    setAnswerNotification("Failed to upload image. Please try again.");
                }
            };
            reader.readAsDataURL(file);
        }

        // Reset input value to allow re-selection of the same file
        fileInput.value = "";
    };

    const handleCapture = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                compressImage(imageSrc, (compressedBase64) => {
                    handleSubmit(compressedBase64);
                });
            } else {
                setAnswerNotification("Failed to capture image. Please try again.");
            }
        }
    };


    const compressImage = (base64String: string, callback: (compressed: string) => void) => {
        const img = new Image();
        img.src = base64String;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const maxWidth = 500;
            const maxHeight = 500;

            let { width, height } = img;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
            callback(compressedBase64);
        };
    };

    async function postEvaluation(payload: any) {
        try {
            const response = await fetch("http://ken6a03.pythonanywhere.com/api/solution/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                return data?.evaluation?.steps || [];
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
    }

    const handleSubmit = async (image: string) => {
        setIsLoading(true)
        if (!image) {
            setAnswerNotification("Please capture or upload an image before submitting.");
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const base64Image = image.split(",")[1]; // Remove "data:image/jpeg;base64,"
            const response = await axios.post("http://ken6a03.pythonanywhere.com/api/ocr/extract_answer", {
                image_data: `data:image/png;base64,${base64Image}`,
            });

            if (response.data && response.data.text) {
                const responseText = response.data.text;

                setAnswerResponse(responseText);
                const payload = {
                    final_answer: responseText.final_answer,
                    steps: responseText.steps,
                };

                setIsLoading(true);
                try {
                    const evaluationData = await postEvaluation(payload);
                    if (evaluationData) {
                        console.log(evaluationData)
                        setEvaluation(evaluationData);
                    }
                } finally {
                    setIsLoading(false); // Always stop loading
                }
            } else {
                setAnswerNotification("Failed to extract text from the image.");
            }
        } catch (error) {
            console.error("API Error:", error);
            setAnswerNotification("An error occurred while submitting the image.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const handleTakePhotoClick = () => {
        if (cameraAccessible) {
            setPhotoMode(true);
            setDropdownOpen(false);
        } else {
            setAnswerNotification("Camera not accessible. Please check your device.");
        }
    };

    const clearNotification = () => {
        setAnswerNotification(null);
    };

    const handleGenerateQuestion = async () => {
        const payload = {
            base_question: output
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
                const responseText = data?.questions
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

    const onEdit = () => {
        setEdit(true)
    }

    const onOk = async () => {
        setIsLoading(true);
        const payload = {
            question: output,
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
                setSolutionResponses(data); // Pass response data to parent component if needed
            } else {
                console.error("Error:", data);
                alert(`Request failed: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Check the console for details.");
        } finally {
            setIsLoading(false); // Stop loading
            setEdit(false)
        }
    }

    console.log(`output: `, output)
    console.log(`outputs: `, similarQuestion)

    return (
        <div className="relative bg-gray-800 p-6 rounded-lg shadow-md mt-6 w-full max-w-6xl mb-10">
            <h2 className="text-xl font-semibold mb-4">Output Display</h2>
            {answerNotification && (
                <div className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                    {answerNotification}
                    <button
                        onClick={clearNotification}
                        className="ml-4 text-sm underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}
            <div className="relative w-full h-[300px] border border-gray-600 p-4 rounded bg-gray-900 text-gray-200 overflow-auto pb-[40px]" >
                {isLoading && <ProgressBar isLoading={isLoading} />}
                {!similarQuestion && mainQuestion && edit &&
                    <EditableMathField
                        latex={mainQuestion}
                        onChange={(mathField) => {
                            setApiResponse(mathField.latex())
                        }}
                    />
                }
                {!similarQuestion && !edit && solutionResponses && mainQuestion && (
                    <div className="mb-3" style={{
                        "pointerEvents": "none"
                    }}>
                        <StaticMathField>{normalizeSlashes(mainQuestion)}</StaticMathField>
                    </div>
                )}
                {!similarQuestion && !isLoading && steps.length > 0 &&
                    <div className="mb-3" style={{
                        "pointerEvents": "none"
                    }}>
                        <RenderSteps steps={steps} />
                        <h4 className="text-lg font-medium mb-2">Final Answer:</h4>
                        <StaticMathField>{normalizeSlashes(finalAnswer)}</StaticMathField>
                    </div>
                }
                {similarQuestion && (
                    <div className="mb-3" style={{
                        "pointerEvents": "none"
                    }}>
                        <h4 className="text-lg font-medium mb-2">Similar Question:</h4>
                        <StaticMathField>{normalizeSlashes(similarQuestion)}</StaticMathField>
                    </div>
                )}
                <div className="flex" style={{
                    "pointerEvents": "none"
                }}>
                    {!isLoading && answerSteps.length > 0 &&
                        <div className="w-[40%]" style={{
                            "pointerEvents": "none"
                        }}>
                            <RenderSteps steps={answerSteps} />
                            <h4 className="text-lg font-medium mb-2">Final Answer:</h4>
                            <StaticMathField>{normalizeSlashes(finalAnswer2)}</StaticMathField>
                        </div>
                    }
                    {evaluation && similarQuestion &&
                        <div className="w-[60%]" style={{
                            "pointerEvents": "none"
                        }}>
                            <RenderEvaluation evaluations={evaluation || []} />
                        </div>
                    }
                </div>
            </div>
            {
                !similarQuestion && solutionResponses &&
                <div className="absolute h-[35px] w-[calc(100%-3rem)] bottom-[25px] flex justify-between bg-gray-900">
                    {!edit ?
                        <button onClick={onEdit} className="h-[35px] bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 rounded shadow hover:opacity-90">
                            Edit
                        </button>
                        :
                        <button onClick={onOk} className="h-[35px] bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 rounded shadow hover:opacity-90">
                            OK?
                        </button>
                    }
                    {steps &&
                        <button
                            className="h-[35px] bg-gradient-to-r from-red-500 to-red-700 text-white px-6 rounded shadow hover:opacity-90"
                            onClick={handleGenerateQuestion}
                        >
                            Similar Question
                        </button>
                    }
                </div>
            }
            {
                similarQuestion &&
                <div className="absolute h-[35px] w-[calc(100%-3rem)] bottom-[25px] flex justify-between bg-gray-900">
                    {!edit ?
                        <button onClick={onEdit} className="h-[35px] bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 rounded shadow hover:opacity-90">
                            Edit
                        </button>
                        :
                        <button onClick={onOk} className="h-[35px] bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 rounded shadow hover:opacity-90">
                            OK?
                        </button>
                    }
                    {similarQuestion &&
                        <button
                            className="h-[35px] bg-gradient-to-r from-green-500 to-green-700 text-white px-6 rounded shadow hover:opacity-90"
                            onClick={handleGenerateQuestion}
                        >
                            Get Solution
                        </button>
                    }
                    {similarQuestion &&
                        <div className="h-[35px] bg-gradient-to-r from-red-500 to-red-700 text-white px-6 rounded shadow hover:opacity-90 flex align-center justify-center">
                            <button
                                onClick={() => {
                                    setDropdownOpen(true); // Explicitly open the dropdown
                                }}
                            >
                                Upload answer
                            </button>

                            {dropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute mt-2 bg-gray-700 shadow-lg rounded-md w-64"
                                >
                                    <ul className="py-2">
                                        <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                                            <label className="cursor-pointer block">
                                                <span>Select from Library</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                                            onClick={handleTakePhotoClick}
                                        >
                                            Take Photo
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {photoMode && (
                                <div className="relative">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="rounded shadow"
                                    />
                                    <button
                                        onClick={handleCapture}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow mt-2"
                                    >
                                        Capture Photo
                                    </button>
                                </div>
                            )}
                        </div>
                    }
                </div>
            }
        </div >
    );
};

export default OutputDisplay;
