import React, { useState, useEffect } from "react";
import { AlertCircle, Check } from "lucide-react";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InputBox } from "../components/InputBox";
import { Header } from "../components/Header";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ScheduleTestSkeleton } from "../components/ScheduleTestSkeleton";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { BRANCHES } from "../utilities/branches";
import { Footer } from "../components/Footer";

const ScheduleTest = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    batch: "",
    branch: "",
    year: "",
    scheduledOn: null,
    hasChangeOfQuestion: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setInit(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/admin/courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.status === 200) {
        setCourses(response.data.courses);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      setError("Failed to fetch courses");
      console.error(err);
    } finally {
      setInit(false);
    }
  };

  if (init) {
    return <ScheduleTestSkeleton />;
  }

  const validateForm = () => {
    if (!formData.courseId) {
      setError("Please select a course");
      return false;
    }
    if (!formData.batch) {
      setError("Please enter a batch");
      return false;
    }
    if (!formData.branch) {
      setError("Please enter a branch");
      return false;
    }
    if (!formData.year) {
      setError("Please enter a year");
      return false;
    }
    if (!formData.scheduledOn) {
      setError("Please select a scheduled date and time");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSubmit = {
        ...formData,
        scheduledOn: formData.scheduledOn?.toISOString(),
      };

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/scheduletest`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Test scheduled successfully!");
        setFormData({
          courseId: "",
          batch: "",
          branch: "",
          year: "",
          scheduledOn: null,
          hasChangeOfQuestion: false,
        });
      } else {
        setError(response.data.message || "Failed to schedule test");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while scheduling the test"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header userRole={"Teacher"} />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-center text-green-600">
              Schedule Test
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course
                </label>
                <select
                  id="course"
                  value={formData.courseId}
                  onChange={(e) => {
                    if (e.target.value === "newCourse") {
                      navigate("/admin/course");
                    }
                    setFormData((prev) => ({
                      ...prev,
                      courseId: e.target.value,
                    }));
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-transparent border-b"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title.toUpperCase()}
                    </option>
                  ))}
                  <option value="newCourse">
                    Add new Course / Add questions to Existing{" "}
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-700"
                >
                  Branch
                </label>
                <select
                  id="branch"
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, branch: e.target.value }))
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-transparent border-b"
                >
                  <option value="">Select branch</option>
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputBox
                  text="Batch"
                  type="text"
                  value={formData.batch}
                  setter={(value) =>
                    setFormData((prev) => ({ ...prev, batch: value }))
                  }
                />

                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Year
                  </label>
                  <select
                    id="year"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        year: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-transparent border-b"
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="scheduledOn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Schedule Date & Time
                </label>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    defaultValue={dayjs()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        scheduledOn: e,
                      }))
                    }
                  />
                </LocalizationProvider>
              </div>

              <div className="flex items-center">
                <input
                  id="hasChangeOfQuestion"
                  type="checkbox"
                  checked={formData.hasChangeOfQuestion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasChangeOfQuestion: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="hasChangeOfQuestion"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Provide change of question
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Scheduling..." : "Schedule Test"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScheduleTest;
