import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Header from "../layouts/Header";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { AuthServices } from "@/services/auth.api";
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from "@/hooks/useAuth";

const SignupPage = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handles input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      if (step === 1) {
        // You can capture the email here before moving to the next step

        const response = await AuthServices.checkAccount(formData.email);
        if (response?.found == true) {
          return toast.error("User already exists");
        }
      } else if (step === 2) {
        const name = formData.firstName + " " + formData.lastName;
        await AuthServices.signup(name, formData.email, formData.password);

        toast.success("Account created successfully");

        navigate("/login");
      }

      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if(!credentialResponse.credential) {
      return;
    }
    try {
      const response = await AuthServices.verifyToken(credentialResponse.credential)
      login(response?.user);
      toast.success("Logged in successfully");
      navigate("/dashboard")
    } catch (error: unknown) {
      if (error instanceof Error) toast.error("Google authentication failed: " + error.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center p-8 w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
              Sign up or log in
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              We recommend using your{" "}
              <span className="font-semibold text-gray-700">work email</span>.
            </p>

            <div className="space-y-4 w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log("Login Failed")}
                useOneTap 
                theme="filled_blue"
                shape="rectangular"
                text="signup_with"
              />
            </div>

            <div className="my-6 text-gray-400">or</div>

            <div className="w-full mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md cursor-pointer flex justify-center"
            >
              {loading ? (
                <Spinner className="size-6 text-blue-200" />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center p-8 w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
              Sign up or log in
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              We recommend using your{" "}
              <span className="font-semibold text-gray-700">work email</span>.
            </p>

            <div className="w-full space-y-4 mb-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6 text-center">
              By selecting "Agree and sign up" I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Zenith Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Services Agreement
              </a>
              . Learn about how we use and protect your data in our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              Agree and sign up
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-xl overflow-hidden">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 flex items-center gap-2 text-blue-600 hover:underline transition-colors duration-200"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          )}
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
