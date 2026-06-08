
function Header() {
  return (
    <header className="flex justify-between items-center p-6 md:px-16 border-b border-gray-200">
      <div className="flex items-center gap-2 font-bold text-2xl">
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
        <h1 className="text-2xl">Zenith</h1>
      </div>
    </header>
  );
}

export default Header;
