import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 600 450"
                  role="img"
                  aria-label="Zenith logo"
                >
                  <path
                    d="M100 350 L300 150 L500 350 L430 350 L300 220 L170 350 Z"
                    fill="#000000"
                  />
                  <circle cx="300" cy="80" r="35" fill="#000000" />
                </svg>
              </div>
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900 tracking-tight">Zenith</span>
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
