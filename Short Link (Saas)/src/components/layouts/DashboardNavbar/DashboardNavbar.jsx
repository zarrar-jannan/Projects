import { Logo } from "../../common/Logo/Logo"
import { SearchBar } from "../../common/SearchBar/SearchBar";
import { Bell } from "lucide-react";
import { Account } from "../../common/Account/Account";
import { PanelLeftOpen } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

export function DashNav({showSideBar,setShowSideBar}) {

  const [showSearchBar,setShowSearchBar] = useState(false)

  useEffect(()=>{
    function clickOutSide(e){ 
        if(!e.target.closest('#searchBar') &&  !e.target.closest('#searchBtn')){
            setShowSearchBar(false)
        }
    }

    document.addEventListener('click',clickOutSide)

    return ()=>document.removeEventListener('click',clickOutSide)

  },[])

  function handleSidebar() {
    setShowSideBar(!showSideBar)
  }


  function handleSearchBar(){
     setShowSearchBar(true)
  }


  return (
    <nav className="w-full h-[40px] bg-[#1f272d] flex items-center justify-between">
      <div className="p-2 flex items-center justify-center  gap-5">
        <button onClick={handleSidebar} style={{ transform: `rotate(${showSideBar ? 180 : 0}deg)`, transition: "transform 0.3s ease", }} className="cursor-pointer text-white"> <PanelLeftOpen size={18}></PanelLeftOpen> </button>
        <Logo size="20px"></Logo>
      </div>

      <div className="w-[30%] h-full relative flex items-center justify-center">
        <SearchBar
          id="searchBar"
          className={`absolute z-30 ${showSearchBar ? 'flex' : 'hidden'} md:flex top-1/2 left-1/2 -translate-1/2 md:-translate-0 md:top-0 md:left-0 md:relative bg-[#11171c] text-[13px] p-[4px] border-[0.2px] border-[#333b40] w-[90vw] md:w-full font-[Inter] gap-2`}
          placeholder="Search, links, pages, and more..." />

          <button id="searchBtn" aria-label="toggle-search" onClick={handleSearchBar} className="flex md:hidden cursor-pointer bg-[#11171c] p-2 rounded-[3px] justify-center items-center">
             <FaSearch color="white" size={16}></FaSearch>
          </button> 
      </div>


      <div className="flex  items-center justify-center gap-3 mr-6">
        <Bell size={20} className="cursor-pointer text-white" />
        <Account></Account>
      </div>

    </nav>
  )
}

