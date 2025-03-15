import { Loader2, Play, Send } from "lucide-react";
import {
  allPassedAtom,
  erro403Atom,
  errorAtom,
  expectedOutputAtom,
  failedInputAtom,
  isCheatedAtom,
  isRunningAtom,
  isSubmittingAtom,
  messageAtom,
  outputAtom,
  submittedAtom,
  testInputAtom,
  viewAtom,
  yourOutputAtom,
} from "../store/atoms/atoms";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { questionAtomFamily } from "../store/atoms/programQuestionAtoms";
import { Editor } from "@monaco-editor/react";
import { handleRun } from "../utilities/handleRun";
import { handleSubmit } from "../utilities/handleSubmit";

const loadBoilerplate = async (language) => {
  try {
    const module = await import(`../boilerplates/${language}.js`);
    return {
      code: module.code,
      version: module.version,
    };
  } catch (error) {
    console.error(`Error loading ${language} boilerplate:`, error);
    return {
      code: "// Error loading boilerplate",
      version: "1.0.0",
    };
  }
};

export function ProgramEditor({ id }) {
  const [language, setLanguage] = useState("c");
  const [version, setVersion] = useState("10.2.0");
  const [languages] = useState(["c", "cpp", "java", "javascript", "python"]);
  const [code, setCode] = useState("");
  const [keyStrokeCount, setKeystrokeCount] = useState(0);
  const [boilerplateLength, setBoilerplateLength] = useState(0);

  const question = useRecoilValue(questionAtomFamily(id));

  const [testInput, setTestInput] = useRecoilState(testInputAtom);
  const [isRunning, setIsRunning] = useRecoilState(isRunningAtom);
  const [isSubmitting, setIsSubmitting] = useRecoilState(isSubmittingAtom);

  const setOutput = useSetRecoilState(outputAtom);
  const setError = useSetRecoilState(errorAtom);
  const setMessage = useSetRecoilState(messageAtom);
  const setAllPassed = useSetRecoilState(allPassedAtom);
  const setFailedInput = useSetRecoilState(failedInputAtom);
  const setExpectedOutput = useSetRecoilState(expectedOutputAtom);
  const setYourOutput = useSetRecoilState(yourOutputAtom);
  const setView = useSetRecoilState(viewAtom);
  const set403Error = useSetRecoilState(erro403Atom);
  const setIsCheated = useSetRecoilState(isCheatedAtom);
  const setSubmitted = useSetRecoilState(submittedAtom);

  const setters = {
    setIsSubmitting,
    setView,
    setFailedInput,
    setExpectedOutput,
    setYourOutput,
    setOutput,
    setError,
    setMessage,
    setAllPassed,
    setIsRunning,
    set403Error,
    setIsCheated,
    setSubmitted,
  };

  useEffect(() => {
    const setInitialBoilerplate = async () => {
      const boilerplate = await loadBoilerplate(language);
      setCode(boilerplate.code);
      setVersion(boilerplate.version);
      setKeystrokeCount(0);
      setBoilerplateLength(boilerplate.code.length);
    };

    setInitialBoilerplate();
  }, [language]);

  useEffect(() => {
    if (question?.sampleTestCase?.input) {
      setTestInput(question.sampleTestCase.input);
    }
  }, [question]);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    const boilerplate = await loadBoilerplate(lang);
    setCode(boilerplate.code);
    setVersion(boilerplate.version);
    setKeystrokeCount(0);
    setBoilerplateLength(boilerplate.code.length);
  };

  const onSubmit = () => {
    handleSubmit({
      id,
      question,
      language,
      version,
      code,
      setters,
      codeLength: code.length - boilerplateLength,
      keyStrokeCount,
    });
  };

  const onRun = () => {
    handleRun({
      id,
      question,
      language,
      version,
      code,
      testInput,
      setters,
    });
  };

  const handleEditorDidMount = (editor) => {
    editor.onDidChangeModelContent(() => {
      setKeystrokeCount((prev) => prev + 1);
    });
  };

  return (
    <div className="h-full p-4">
      <div className="flex items-center space-x-2 mb-4 mr-3">
        <label className="text-lg font-medium text-green-400">Language:</label>
        <select
          className="p-2 border border-gray-50 rounded-md h-10 text-xs"
          onChange={(e) => handleLanguageChange(e.target.value)}
          value={language}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
        <div className="flex justify-end w-full space-x-2">
          <button
            className="py-1 px-4 border border-green-500 text-green-500 rounded-md hover:bg-gray-100 transition duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run
          </button>
          <button
            className="py-1 px-4 border border-green-500 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Submit
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-4rem)]">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 16,
          }}
          className="border border-gray-100 p-5 rounded-md"
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}
