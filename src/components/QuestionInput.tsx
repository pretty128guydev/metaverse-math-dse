import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";

interface QuestionInputProps {
    questionNotification: string | null;
    setQuestoinNotification: React.Dispatch<React.SetStateAction<string | null>>;
    setIsLoading: (loading: boolean) => void;
    setSolutionResponses: (response: any) => void
    setApiResponse: (response: any) => void
}

const QuestionInput: React.FC<QuestionInputProps> = ({
    questionNotification,
    setQuestoinNotification,
    setIsLoading,
    setSolutionResponses,
    setApiResponse
}) => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [photoMode, setPhotoMode] = useState(false);
    const [cameraAccessible, setCameraAccessible] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(() => {
                setCameraAccessible(true);
            })
            .catch(() => {
                setCameraAccessible(false);
            });
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        if (capturedImage) {
            setDropdownOpen(false);
        }

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [dropdownOpen, capturedImage]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (result) {
                    compressImage(result, (compressedBase64) => {
                        handleSubmit(compressedBase64);
                    });
                } else {
                    setQuestoinNotification("Failed to upload image. Please try again.");
                }
            };
            reader.readAsDataURL(file);
        }

        fileInput.value = "";
    };

    const handleCapture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                compressImage(imageSrc, (compressedBase64) => {
                    setCapturedImage(compressedBase64);
                    handleSubmit(compressedBase64);
                });
            } else {
                setQuestoinNotification("Failed to capture image. Please try again.");
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

    const handleSubmit = async (image: string) => {
        if (!image) {
            setQuestoinNotification("Please capture or upload an image before submitting.");
            return;
        }

        setIsLoading(true);
        try {
            const base64Image = image.split(",")[1];
            const response = await axios.post("http://ken6a03.pythonanywhere.com/api/ocr/extract", {
                image_data: `data:image/png;base64,${base64Image}`,
            });

            if (response.data && response.data.text) {
                setApiResponse(response.data.text)
                const payload = {
                    question: response.data.text,
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
                }
            } else {
                setQuestoinNotification("Failed to extract text from the image.");
            }
        } catch (error) {
            console.error("API Error:", error);
            setQuestoinNotification("An error occurred while submitting the image.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTakePhotoClick = () => {
        if (cameraAccessible) {
            setPhotoMode(true);
            setDropdownOpen(false);
        } else {
            setQuestoinNotification("Camera not accessible. Please check your device.");
        }
    };

    const clearNotification = () => {
        setQuestoinNotification(null);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md relative w-full max-w-6xl mb-10">
            <h2 className="text-xl font-semibold mb-4">Question Input</h2>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={() => {
                        setDropdownOpen(true);
                        setCapturedImage(null);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-center"
                >
                    Upload Question
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

                {questionNotification && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                        {questionNotification}
                        <button
                            onClick={clearNotification}
                            className="ml-4 text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionInput;
