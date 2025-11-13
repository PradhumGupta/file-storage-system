import { ChevronDown, Folder, HardDrive, ImageIcon, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function Sidebar({ activeTab = 'All files' }: {activeTab: string}) {
  const { workspaceName } = useParams();
    const sidebarNavItems = [
    { name: 'All files', icon: <HardDrive size={18} />, link: `/dashboard/${workspaceName}` },
    { name: 'Photos', icon: <ImageIcon size={18} />, link: "" },
    {name: 'Teams', icon: <Users size={18} />, link: `/dashboard/${workspaceName}/teams`},
    {name: 'Members', icon: <Users size={18} />, link: `/dashboard/${workspaceName}/members`},
  ];

  const navigate = useNavigate()

  const folders = [
    'Design',
    'Sales Collateral',
    'Remodels',
    'Taxes',
  ];

  return (
    <aside className="w-1/5 min-w-30 max-w-300 h-screen bg-gray-50 flex-shrink-0 p-8 border-r border-gray-200 flex flex-col">
      {/* Top of Sidebar */}
      <div className="mb-10 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
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

        <h1 className="text-2xl font-bold text-gray-800">Zenith</h1>
      </div>
      {/* Main Navigation */}
      <nav className="space-y-4 mb-8">
        {sidebarNavItems.map((item, index) =>
          workspaceName === "personal" &&
          (item.name === "Members" || item.name === "Teams") ? (
            <></>
          ) : (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors duration-200 cursor-pointer
                  ${
                    item.name === activeTab
                      ? "bg-gray-200 text-black"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              onClick={() => {
                if (item.name !== activeTab) navigate(item.link);
              }}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
          )
        )}
      </nav>
      {/* Folders Section */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4 text-gray-500">
          <span className="text-sm font-semibold uppercase">Folders</span>
          <span className="text-sm hover:text-gray-700 transition-colors duration-200">
            <ChevronDown size={18} />
          </span>
        </div>
        <div className="space-y-2 overflow-y-auto">
          {folders.map((folder, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <Folder size={20} className="text-gray-400" />
              <span>{folder}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar