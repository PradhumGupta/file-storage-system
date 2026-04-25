
export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center">
            <div className="flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
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
            <span className="text-xl font-bold text-slate-900 tracking-tight">Zenith</span>
          </div>

          <div className="flex space-x-8 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Zenith. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
