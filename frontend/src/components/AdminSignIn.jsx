import React, { useState } from "react";
import { InputBox } from "./InputBox";
import { LoginButton } from "./LoginButton";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { validateAdminSignInForm } from "../utilities/validate";

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

export default function AdminSignIn() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const notValid = validateAdminSignInForm(formData);

      if (notValid) {
        setErrors((prev) => ({
          ...prev,
          submit: notValid,
        }));
        return;
      }
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/signin`,
        formData
      );
      if (response.status === 200) {
        setFormData(INITIAL_FORM_STATE);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userRole", "Teacher");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to sign in. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formFields = [
    { key: "email", text: "Email", type: "email" },
    { key: "password", text: "Password", type: "password" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      {formFields.map((field) => (
        <InputBox
          key={field.key}
          text={field.text}
          type={field.type}
          value={formData[field.key]}
          setter={updateField(field.key)}
        />
      ))}
      <div>
        <LoginButton
          loading={loading}
          text="Log In"
          loadingText="Logging in..."
        />
      </div>
    </form>
  );
}
