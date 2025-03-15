import React, { useState } from "react";
import { Plus, Minus, Save, AlertCircle, FilePlus } from "lucide-react";
import axios from "axios";
import { Header } from "../components/Header";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const initialFormState = {
    title: "",
    regularQuestions: [
      {
        id: Date.now(),
        description: "",
        outputFormat: "",
        sampleTestCase: {
          input: "",
          output: "",
          isHidden: false,
        },
        hiddenTestCases: [],
      },
    ],
    vivaQuestions: [
      {
        id: Date.now() + 1,
        question: "",
        options: Array(4)
          .fill("")
          .map(() => ({
            text: "",
            isCorrect: false,
          })),
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = (type = "regular") => {
    setFormData((prev) => ({
      ...prev,
      [type === "regular" ? "regularQuestions" : "vivaQuestions"]: [
        ...prev[type === "regular" ? "regularQuestions" : "vivaQuestions"],
        type === "regular"
          ? {
              id: Date.now(),
              description: "",
              outputFormat: "",
              sampleTestCase: {
                input: "",
                output: "",
                isHidden: false,
              },
              hiddenTestCases: [],
            }
          : {
              id: Date.now(),
              question: "",
              options: Array(4)
                .fill("")
                .map(() => ({
                  text: "",
                  isCorrect: false,
                })),
            },
      ],
    }));
  };

  const addHiddenTestCase = (questionId) => {
    setFormData((prev) => ({
      ...prev,
      regularQuestions: prev.regularQuestions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          hiddenTestCases: [
            ...q.hiddenTestCases,
            { input: "", output: "", isHidden: true },
          ],
        };
      }),
    }));
  };

  const removeQuestion = (questionId, type) => {
    const questionsKey =
      type === "regular" ? "regularQuestions" : "vivaQuestions";
    if (formData[questionsKey].length === 1) {
      setError(`You must have at least one ${type} question`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [questionsKey]: prev[questionsKey].filter((q) => q.id !== questionId),
    }));
    setError("");
  };

  const updateQuestion = (questionId, type, field, value, index = null) => {
    const questionsKey =
      type === "regular" ? "regularQuestions" : "vivaQuestions";
    setFormData((prev) => ({
      ...prev,
      [questionsKey]: prev[questionsKey].map((question) => {
        if (question.id !== questionId) return question;

        if (type === "regular") {
          if (field.startsWith("sampleTestCase.")) {
            const [, subField] = field.split(".");
            return {
              ...question,
              sampleTestCase: {
                ...question.sampleTestCase,
                [subField]: value,
              },
            };
          }
          if (field.startsWith("hiddenTestCase.")) {
            const [, subField] = field.split(".");
            const updatedTestCases = [...question.hiddenTestCases];
            updatedTestCases[index] = {
              ...updatedTestCases[index],
              [subField]: value,
            };
            return {
              ...question,
              hiddenTestCases: updatedTestCases,
            };
          }
          return { ...question, [field]: value };
        } else {
          if (field === "optionText") {
            const newOptions = [...question.options];
            newOptions[index] = { ...newOptions[index], text: value };
            return { ...question, options: newOptions };
          }
          if (field === "isCorrect") {
            const newOptions = question.options.map((opt, idx) => ({
              ...opt,
              isCorrect: idx === index,
            }));
            return { ...question, options: newOptions };
          }
          return { ...question, [field]: value };
        }
      }),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Course title is required");
      return false;
    }

    for (const question of formData.regularQuestions) {
      if (!question.description.trim()) {
        setError("All regular questions must have a description");
        return false;
      }
      if (!question.outputFormat.trim()) {
        setError("All regular questions must have an output format");
        return false;
      }
      if (
        !question.sampleTestCase.input.trim() ||
        !question.sampleTestCase.output.trim()
      ) {
        setError("All regular questions must have sample test cases");
        return false;
      }
    }

    for (const question of formData.vivaQuestions) {
      if (!question.question.trim()) {
        setError("All viva questions must have text");
        return false;
      }
      const emptyOptions = question.options.some((opt) => !opt.text.trim());
      if (emptyOptions) {
        setError("All viva question options must be filled");
        return false;
      }
      const hasCorrectOption = question.options.some((opt) => opt.isCorrect);
      if (!hasCorrectOption) {
        setError("Each viva question must have one correct option");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      for (const question of formData.regularQuestions) {
        const formattedDescription = `${question.description}\\n\nOutput Format:\n${question.outputFormat}`;
        await axios.post(
          `${BACKEND_URL}/api/v1/admin/question`,
          {
            coursetitle: formData.title,
            description: formattedDescription,
            sampleTestCase: question.sampleTestCase,
            hiddenTestCases: question.hiddenTestCases,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      for (const question of formData.vivaQuestions) {
        await axios.post(
          `${BACKEND_URL}/api/v1/admin/vivaquestion`,
          {
            coursetitle: formData.title,
            question: question.question,
            options: question.options,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      setFormData(initialFormState);
      alert("Course created successfully!");
      navigate("/admin/tests");
    } catch (err) {
      setError("Failed to create course. Please try again.");
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex lg:hidden items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-3">
            ⚠️ Warning
          </h2>
          <p className="text-gray-700">
            You can only Add or manage courses on laptops or PCs. Mobile devices
            are not supported.
          </p>
          <button
            onClick={() => navigate("/admin/tests")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Okay
          </button>
        </div>
      </div>
      <div>
        <Header userRole={"Teacher"} />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Course Management</h1>
            <button
              onClick={() => setFormData(initialFormState)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FilePlus className="h-4 w-4" />
              New Course
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4">Regular Questions</h3>
                <div className="space-y-4">
                  {formData.regularQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium">
                          Question {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id, "regular")}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={question.description}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "regular",
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="4"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Output Format
                        </label>
                        <textarea
                          value={question.outputFormat}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "regular",
                              "outputFormat",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="Describe the expected output format..."
                        />
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium">Sample Test Case</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Input
                            </label>
                            <textarea
                              value={question.sampleTestCase.input}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "regular",
                                  "sampleTestCase.input",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Output
                            </label>
                            <textarea
                              value={question.sampleTestCase.output}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "regular",
                                  "sampleTestCase.output",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">Hidden Test Cases</h5>
                          <button
                            type="button"
                            onClick={() => addHiddenTestCase(question.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {question.hiddenTestCases.map((testCase, tcIndex) => (
                          <div key={tcIndex} className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Input
                              </label>
                              <textarea
                                value={testCase.input}
                                onChange={(e) =>
                                  updateQuestion(
                                    question.id,
                                    "regular",
                                    "hiddenTestCase.input",
                                    e.target.value,
                                    tcIndex
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Output
                              </label>
                              <textarea
                                value={testCase.output}
                                onChange={(e) =>
                                  updateQuestion(
                                    question.id,
                                    "regular",
                                    "hiddenTestCase.output",
                                    e.target.value,
                                    tcIndex
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addQuestion("regular")}
                    className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Regular Question
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4">Viva Questions</h3>
                <div className="space-y-4">
                  {formData.vivaQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium">
                          Question {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id, "viva")}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Text
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "viva",
                              "question",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="4"
                        />
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium">
                          Options (Select the correct option aswell)
                        </h5>
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="radio"
                              checked={option.isCorrect}
                              onChange={() =>
                                updateQuestion(
                                  question.id,
                                  "viva",
                                  "isCorrect",
                                  true,
                                  optIndex
                                )
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "viva",
                                  "optionText",
                                  e.target.value,
                                  optIndex
                                )
                              }
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addQuestion("viva")}
                    className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Viva Question
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {loading ? "Creating" : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
