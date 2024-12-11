import React, { useEffect, useState } from "react";
import Upload from "./components/Upload";
import Action from "./components/Action";
import BPanel from "./components/BPanel";
import CPanel from "./components/CPanel";
import { ToastContainer } from "react-toastify";

const calculateZoom = () => {
  const baseWidth = 1800;
  const baseHeight = 950;
  const scaleWidth = window.innerWidth / baseWidth; // Scale relative to viewport width
  const scaleHeight = window.innerHeight / baseHeight; // Scale relative to viewport height
  return Math.min(scaleWidth, scaleHeight);
};

const App: React.FC = () => {
  const [zoom, setZoom] = useState(calculateZoom());
  const [apiResponses] = useState<string>("");
  const [questionImage, setQuestionImage] = useState<string>("");
  const [solutionResponses, setSolutionResponses] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [similarQuestion, setSetSimilarQuestion] = useState<string>("");
  const [answerResponse, setAnswerResponse] = useState<any>("");
  const [evaluation, setEvaluation] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<string>("Question");

  useEffect(() => {
    const handleResize = () => setZoom(calculateZoom());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url(/background.jpeg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="zoom-container m-4" style={{ zoom }}>
        <div className="min-h-screen flex-grow flex flex-col sm:flex-row justify-around">
          {/* Upload */}
          <Upload
            setIsLoading={setIsLoading}
            setQuestionImage={setQuestionImage}
            setAnswerResponse={setAnswerResponse}
            setEvaluation={setEvaluation}
            uploadType={uploadType}
            setUploadType={setUploadType}
          />

          {/* Actions */}
          <div className="w-full sm:w-[67%] flex flex-col justify-between m-10">
            <div className="relative rounded-md p-4 flex-grow  mt-5">
              {/* {Actions} */}
              <Action
                edit={edit}
                setSolutionResponses={setSolutionResponses}
                questionImage={questionImage}
                setIsLoading={setIsLoading}
                setSetSimilarQuestion={setSetSimilarQuestion}
                setEvaluation={setEvaluation}
                answerResponse={answerResponse}
                uploadType={uploadType}
                setEdit={setEdit} />
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-1 h-full">
                <BPanel
                  uploadType={uploadType}
                  setAnswerResponse={setAnswerResponse}
                  edit={edit}
                  answerResponse={answerResponse}
                  similarQuestion={similarQuestion}
                  setQuestionImage={setQuestionImage}
                  setIsLoading={setIsLoading}
                  solutionResponses={solutionResponses}
                  questionImage={questionImage}
                  isLoading={isLoading} />
                <CPanel
                  evaluation={evaluation}
                  isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        closeButton={false}
        theme={"dark"}
      />
    </div>
  );
};

export default App;
