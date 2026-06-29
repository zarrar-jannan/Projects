import { House } from "lucide-react";
import { Link } from "lucide-react";
import { QrCode } from "lucide-react";
import { LayoutPanelTop } from "lucide-react";
import { ChartColumnIncreasing } from "lucide-react";
import { Plus } from "lucide-react";
import { BookLock } from "lucide-react";
import { CircleStar } from "lucide-react";
import { Settings } from "lucide-react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";


export function DashboardSidebar({ showSideBar, setShowSideBar }) {

  const options = [
    { name: 'Home', icon: House, id: '#ht5u5y7', slug: '/home' },
    { name: 'Links', icon: Link, id: '#ht55ty7', slug: '/links' },
    { name: 'Qr Codes', icon: QrCode, id: '#htj4ty7', slug: '/qr-codes' },
    { name: 'Pages', icon: LayoutPanelTop, id: '#hhj4ty7', slug: '/pages' },
    { name: 'Analytics', icon: ChartColumnIncreasing, id: '#hhj45jj', slug: '/analytics' },
    { name: 'Private', icon: BookLock, id: '#586fj3j', slug: '/private' },
    { name: 'Media', icon: CircleStar, id: '#tu4fj3j', slug: '/media' },
  ]

  const navigate = useNavigate()



  return (
    <div className={`h-[calc(100vh-40px)] ${showSideBar ? 'w-full sm:w-[200px]' : 'w-0 sm:w-auto sm:p-2'} absolute z-[100000000] left-0 sm:relative custom-scrollbar overflow-y-auto flex gap-8 flex-col justify-start items-center bg-[#1f272d]   transition-all duration-300 ease-in-out `}>
      <div>
        <button className={`mt-8 flex items-center justify-center gap-2 rounded-lg border border-[#343c42] bg-[#2a3339] px-4 py-2.5  cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#333d44] hover:border-[#46515a] hover:shadow-lg active:scale-95`}>
          <Plus size={20} className="text-blue-400 shrink-0" strokeWidth={2.5} />
          <span className={`font-[Inter] font-semibold text-sm text-white whitespace-nowrap overflow-hidden transition-all duration-300 ${showSideBar ? "max-w-[100px] block" : "max-w-0 hidden"}`}>CREATE</span>
        </button>

      </div>

      <div className="w-full ">
        <ul className="w-full h-full flex flex-col gap-6">
          {options.map(option => {
            const Icon = option.icon

            return <NavLink to={option.slug} key={option.id} className={({ isActive }) => `${showSideBar ? 'justify-start' : 'justify-center'} flex items-center gap-3 px-3 py-2 relative cursor-pointer group hover:bg-[#2a3339] rounded-md ${isActive ? "bg-blue-500/15 text-blue-400" : null}`}>

              <Icon size={showSideBar ? 20 : 22} className={'text-white'} />

              {showSideBar && (
                <span className="text-white text-sm font-[Inter]">
                  {option.name}
                </span>
              )}
            </NavLink>
          })}
        </ul>

        <div>
          <button onClick={() => navigate('/settings')} className="group m-auto w-[90%] flex items-center gap-3 px-4 py-3 rounded-lg border border-[#343c42] bg-[#252d33] text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#2f3940] hover:border-[#46515a] hover:shadow-md active:scale-[0.98]">
            <Settings size={20} className="text-gray-300 shrink-0  transition-transform duration-500 ease-in-out group-hover:rotate-180" />

            <span className={`font-[Inter] text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${showSideBar ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"}`}>
              Settings
            </span>
          </button>
        </div>
      </div>
    </div >
  )
}

