import React from "react";

interface ActionsProps {
    setApiResponses: (response: string) => void;
    setSolutionResponses: (response: string) => void;
    setIsLoading: (loading: boolean) => void;
    output: string | null;
}

const Actions: React.FC<ActionsProps> = ({ setIsLoading, setApiResponses, setSolutionResponses, output }) => {

    function latexToPlainText(latexExpression: string | null) {
        // Replace LaTeX \text{} with plain text
        if (!latexExpression) {
            console.log("latexExpression is null")
        } else {
            // Replace LaTeX \text{} with plain text
            latexExpression = latexExpression.replace(/\\text\{([^}]*)\}/g, "$1");

            // Replace LaTeX fractions \frac{}{} with plain text format
            latexExpression = latexExpression.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)");

            // Replace superscripts {} with plain ^ format
            latexExpression = latexExpression.replace(/\{([^{}]*)\}/g, "$1");

            // Clean up spaces and LaTeX-specific syntax
            latexExpression = latexExpression.replace(/\\/, ""); // Remove remaining backslashes

            return latexExpression.trim();
        }
    }

    const handleGenerateQuestion = async () => {
        console.log(output)
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
                let responseText = data?.questions[0]
                responseText = responseText.replace(/\\[|\\]/g, "").trim();
                setApiResponses(responseText);
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

    const handleSubmit = async () => {
        console.log(output)
        const payload = {
            question: output,
        };

        setIsLoading(true);
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
    };

    return (
        <div className="flex space-x-4 my-8">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 rounded shadow hover:opacity-90">
                Edit
            </button>
            <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded shadow hover:opacity-90"
                onClick={handleSubmit}
            >
                Submit
            </button>
            <button
                className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded shadow hover:opacity-90"
                onClick={handleGenerateQuestion}
            >
                Generate Question
            </button>
        </div>
    );
};

export default Actions;