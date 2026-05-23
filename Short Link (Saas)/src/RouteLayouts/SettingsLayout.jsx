import { Outlet } from "react-router"
import { SettingSideBar } from "../components/layouts/SettingSideBar/SettingSideBar"
import { useState } from "react"
import { UserRoundPen,BellDot, SquareUserRound,Receipt } from "lucide-react"

function SettingsLayout() {

    const [showSettingOps,setShowSettOps] = useState(true)
    const settingOptions = [
        { name: "Profile", path: "profile",icon: UserRoundPen, id: 'r4uf4hu' },
        { name: "Account", path: "account",icon: SquareUserRound, id: 'g544huw' },
        { name: "Notifications", path: "notifications",icon: BellDot, id: "tete44u" },
        { name: "Plans", path: "plans",icon: Receipt, id: "j8htitr" },
    ]

    return (
        <div className="w-full relative flex items-center justify-center bg-black">
            <SettingSideBar showSettingOps={showSettingOps} setShowSettOps={setShowSettOps} options={settingOptions}></SettingSideBar>
            <Outlet></Outlet>
        </div>
    )
}

export default SettingsLayout