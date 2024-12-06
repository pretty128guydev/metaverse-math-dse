import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";

interface AnswerInputProps {
    notification: string | null;
    setNotification: React.Dispatch<React.SetStateAction<string | null>>;
    setIsLoading: (loading: boolean) => void;
    setAnswerResponse: (response: string) => void;
}

const AnswerInput: React.FC<AnswerInputProps> = ({
    notification,
    setNotification,
    setIsLoading,
    setAnswerResponse,
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
                    setCapturedImage(result);
                    setDropdownOpen(false);

                    // Call handleSubmit after setting the image
                    handleSubmit(result);
                } else {
                    setNotification("Failed to upload image. Please try again.");
                }
            };
            reader.readAsDataURL(file);
        }

        // Reset input value to allow re-selection of the same file
        fileInput.value = "";
    };


    const handleCapture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCapturedImage(imageSrc);
                setDropdownOpen(false);

                // Call handleSubmit after capturing the image
                handleSubmit(imageSrc);
            } else {
                setNotification("Failed to capture image. Please try again.");
            }
        }
    };

    const handleSubmit = async (image: string) => {
        if (!image) {
            setNotification("Please capture or upload an image before submitting.");
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const base64Image = image.split(",")[1]; // Remove "data:image/jpeg;base64,"
            const response = await axios.post("http://ken6a03.pythonanywhere.com/api/ocr/extract_answer", {
                image_data: `data:image/png;base64,${base64Image}`,
            });

            if (response.data && response.data.text) {
                let responseText = response.data.text;

                responseText = responseText
                    .replace(/\\\[|\\\]/g, "")
                    .replace(/\\\(/g, "")
                    .replace(/\\\)/g, "")
                    .replace(/(Given:|For:|Thus:|Therefore:|Final Answer:)/g, "\n$&")
                    .trim();

                setAnswerResponse(responseText);
            } else {
                setNotification("Failed to extract text from the image.");
            }
        } catch (error) {
            console.error("API Error:", error);
            setNotification("An error occurred while submitting the image.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const handleTakePhotoClick = () => {
        if (cameraAccessible) {
            setPhotoMode(true);
            setDropdownOpen(false);
        } else {
            setNotification("Camera not accessible. Please check your device.");
        }
    };

    const clearNotification = () => {
        setNotification(null);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md relative">
            <h2 className="text-xl font-semibold mb-4">Answer Input</h2>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={() => {
                        setDropdownOpen(true); // Explicitly open the dropdown
                        setCapturedImage(null); // Reset the captured image to allow new uploads
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow text-center"
                >
                    Upload Answer
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

                {capturedImage && (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="mt-4 rounded shadow"
                    />
                )}
                {notification && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                        {notification}
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

export default AnswerInput;
