import React, { useState } from "react";
import QuestionInput from "./components/QuestionInput";
import AnswerInput from "./components/AnswerInput";
import OutputDisplay from "./components/OutputDisplay";
import Actions from "./components/Actions";
import axios from "axios";

const App: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiResponses, setApiResponses] = useState<string | null>(null);
  const [answerResponses, setAnswerResponse] = useState<string | null>(null);
  const [solutionResponses, setSolutionResponses] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  return (
    <div>
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
        <header className="w-full flex justify-center items-center px-5 py-4 shadow-md bg-gray-800">
          <h1 className="text-3xl font-bold text-blue-400">
            Metamersive Math DSE
          </h1>
        </header>

        <main className="flex-grow flex flex-col items-center px-5 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
            <QuestionInput
              setNotification={setNotification}
              notification={notification}
              setIsLoading={setIsLoading}
              setApiResponse={setApiResponse}
            />
            <AnswerInput
              setNotification={setNotification}
              notification={notification}
              setIsLoading={setIsLoading}
              setAnswerResponse={setAnswerResponse} />
          </div>
          <Actions
            output={apiResponse}
            setIsLoading={setIsLoading}
            setApiResponses={setApiResponses} setSolutionResponses={setSolutionResponses} />
          <OutputDisplay isLoading={isLoading} output={apiResponse} outputs={apiResponses} solutionResponses={solutionResponses} answerResponses={answerResponses} />
        </main>

        <footer className="w-full py-4 text-center bg-gray-800 text-gray-400">
          © {new Date().getFullYear()} Metamersive Math DSE
        </footer>
      </div>
    </div>
  );
};

export default App;
