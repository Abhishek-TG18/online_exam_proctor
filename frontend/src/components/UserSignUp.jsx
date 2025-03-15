import React, { useRef, useState } from "react";
import { InputBox } from "./InputBox";
import { LoginButton } from "./LoginButton";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { BRANCHES } from "../utilities/branches";
import { validateUserSignUpForm } from "../utilities/validate";

const INITIAL_FORM_STATE = {
  username: "",
  email: "",
  password: "",
  usn: "",
  batch: "",
  year: "",
  branch: "",
};

export default function UserSignUp() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const updateField = (key) => (value) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    try {
      startResendTimer();
      await axios.post(`${BACKEND_URL}/api/v2/user/signup/init`, formData);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to resend OTP. Please try again.",
      }));
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const notValid = validateUserSignUpForm(formData);
      if (notValid) {
        setErrors((prev) => ({
          ...prev,
          submit: notValid,
        }));
        return;
      }
      const response = await axios.post(
        `${BACKEND_URL}/api/v2/user/signup/init`,
        formData
      );
      if (response.status === 200) {
        setShowOTP(true);
        setErrors({});
        startResendTimer();
      }
    } catch (error) {
      console.error("Sign up initialization error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to send OTP. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v2/user/signup/verify`,
        {
          otp: otp.join(""),
          email: formData.email,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userRole", "Student");
        setFormData(INITIAL_FORM_STATE);
        setOtp(["", "", "", "", "", ""]);
        setShowOTP(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrors((prev) => ({
        ...prev,
        otp: "Invalid OTP. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={showOTP ? handleVerifyOTP : handleInitialSubmit}
      className="space-y-4"
    >
      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      {!showOTP ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputBox
                key="username"
                text="Name"
                type="text"
                value={formData.username}
                setter={updateField("username")}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            <div>
              <InputBox
                key="email"
                text="Email"
                type="email"
                value={formData.email}
                setter={updateField("email")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputBox
                key="usn"
                text="USN"
                type="text"
                value={formData.usn}
                setter={updateField("usn")}
              />
            </div>
            <div>
              <InputBox
                key="password"
                text="Password"
                type="password"
                value={formData.password}
                setter={updateField("password")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputBox
                key="batch"
                text="Lab Batch"
                type="text"
                value={formData.batch}
                setter={updateField("batch")}
              />
            </div>
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
                onChange={(e) => updateField("year")(e.target.value)}
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
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            <select
              id="branch"
              value={formData.branch}
              onChange={(e) => updateField("branch")(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-transparent border-b"
            >
              <option value="">Select your branch</option>
              {BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.otp && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.otp}
            </div>
          )}
          <div>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={data}
                  ref={(input) => (inputRefs.current[index] = input)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-2xl text-center bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ease-in-out"
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Please enter the OTP sent to your email address
            </p>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendDisabled}
                className={`text-sm ${
                  resendDisabled
                    ? "text-gray-400"
                    : "text-green-600 hover:text-green-700"
                }`}
              >
                {resendDisabled
                  ? `Resend OTP in ${resendTimer}s`
                  : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <LoginButton
          loading={loading}
          text={showOTP ? "Verify OTP" : "Create account"}
          loadingText={showOTP ? "Verifying OTP..." : "Sending OTP..."}
        />
      </div>
    </form>
  );
}
