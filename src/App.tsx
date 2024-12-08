import React, { useState } from "react";
import QuestionInput from "./components/QuestionInput";
import AnswerInput from "./components/AnswerInput";
import OutputDisplay from "./components/OutputDisplay";
import Actions from "./components/Actions";
import axios from "axios";
import GenerateQuestion from "./components/GenerateQuestion";
import AnswerOutputDisplay from "./components/AnswerOutputDisplay";

const App: React.FC = () => {
  const [answerNotification, setAnswerNotification] = useState<string | null>(null);
  const [questionNotification, setQuestoinNotification] = useState<string | null>(null);
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
          <div className="grid grid-cols-1 w-full max-w-6xl">
            <QuestionInput
              setQuestoinNotification={setQuestoinNotification}
              questionNotification={questionNotification}
              setIsLoading={setIsLoading}
              setSolutionResponses={setSolutionResponses}
              setApiResponse={setApiResponse}
            />
            {/* <GenerateQuestion /> */}
          </div>
          {/* <Actions
            output={apiResponse}
            setIsLoading={setIsLoading}
            setApiResponses={setApiResponses} setSolutionResponses={setSolutionResponses} /> */}
          <OutputDisplay
            setApiResponse={setApiResponse}
            setIsLoading={setIsLoading} isLoading={isLoading} output={apiResponse} outputs={apiResponses} solutionResponses={solutionResponses} setSolutionResponses={setSolutionResponses} />
          {/* <AnswerInput
            setAnswerNotification={setAnswerNotification}
            answerNotification={answerNotification}
            setIsLoading={setIsLoading}
            setAnswerResponse={setAnswerResponse} />
          <AnswerOutputDisplay
            setIsLoading={setIsLoading} isLoading={isLoading} answerResponses={answerResponses} /> */}
        </main>

        <footer className="w-full py-4 text-center bg-gray-800 text-gray-400">
          © {new Date().getFullYear()} Metamersive Math DSE
        </footer>
      </div>
    </div>
  );
};

export default App;
