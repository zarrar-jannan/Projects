import { TbHelpSquare } from "react-icons/tb";


export function HelpHover({ Info,size }) {
    return (
        <div className=" flex items-center justify-center relative group">
            <TbHelpSquare size={size} className="cursor-help text-zinc-400" />
            <div
                className=" absolute z-[1001] left-0 top-7 w-56 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-300 shadow-xl opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible"                        >
                {Info}
            </div>
        </div>
    )
}

