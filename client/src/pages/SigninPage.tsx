import React, { useEffect, useState } from "react";
import Header from "../layouts/Header";
import { AuthServices } from "../services/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

const SigninPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const {login, user} = useAuth();
  const [loading, setLoading] = useState(false);

  // Handles input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handles form submission (simplified)
  const handleSubmit =async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthServices.login(formData.email, formData.password);
      login(response?.user)
      toast.success("logged in successfully")
    } catch (error: unknown) {
      if(error instanceof Error) toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user) {
      // const workspaceSlug = slugify(`${user.name} + 's Workspace`);
      navigate(`/dashboard/personal`)
    }
  }, [user])


  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-xl overflow-hidden">
          <div className="flex flex-col items-center p-8 w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
              Sign up or log in
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              We recommend using your{" "}
              <span className="font-semibold text-gray-700">work email</span>.
            </p>

            <div className="space-y-4 w-full">
              <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                <img
                  src="https://www.dropbox.com/static/images/empty_states/sign-in-google-icon@2x-vflMvB9fO.png"
                  alt="Google icon"
                  className="w-5 h-5"
                />
                <span>Continue with Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                <img
                  src="https://www.dropbox.com/static/images/empty_states/sign-in-apple-icon@2x-vflhE3LhW.png"
                  alt="Apple icon"
                  className="w-5 h-5"
                />
                <span>Continue with Apple</span>
              </button>
            </div>

            <div className="my-6 text-gray-400">or</div>

            <form onSubmit={handleSubmit} className="w-full mb-6">
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
                required
                className="w-full px-4 py-3 my-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              
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
                  required
                  className="w-full px-4 py-3 my-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
              <button type="submit"
              disabled={loading}
              className="w-full py-3 my-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md cursor-pointer flex justify-center"
            >
              {loading ? <Spinner className="size-6 text-blue-200" /> : "Continue"}
            </button>
              </form>
            </div>

          </div>
      </main>
    </div>
  );
};

export default SigninPage;