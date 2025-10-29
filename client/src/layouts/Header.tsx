import { ServerIcon } from "lucide-react"


function Header() {
  return (
    <header className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
          <ServerIcon size={20} />
          <h1>DropBox</h1>
        </div>
    </header>
  )
}

export default Header