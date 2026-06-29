
import { NavLink } from "react-router"
import { AnimatePresence, motion } from "framer-motion"

export function SettingSideBar({ showSettingOps, setShowSettOps, options }) {

    function handleClick() {
        setShowSettOps(!showSettingOps)
    }

    const containerVariants = {
        hidden: { opacity: 0, },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.20,
            }
        }
    }

    const childVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.3,
            }

        },
    }

    return (
        <motion.div
            animate={{
                width: showSettingOps ? '100%' : '50px',
                height: showSettingOps ? '100%' : '50px',
            }}
            transition={{
                ease: 'linear',
            }}

            className={` absolute z-[10000000] items-start left-0 top-0 bg-[#252126] p-4 rounded-br-[12px]`}
        >

            <div onClick={handleClick} className="cursor-pointer group">
                <div className="relative flex h-3 w-3  items-center justify-center">
                    <span className={`absolute bg-white transition-all duration-300 h-1.5 w-1.5   rounded-[50%] ${showSettingOps ? "rotate-45 h-5 w-2" : "-translate-x-3"}`} />

                    <span className={`absolute bg-white transition-all duration-300 h-1.5 w-1.5   rounded-[50%] ${showSettingOps ? "opacity-0 h-5 w-2" : "opacity-100"}`} />

                    <span className={`absolute bg-white transition-all duration-300 h-1.5 w-1.5   rounded-[50%] ${showSettingOps ? "-rotate-45 h-5 w-2" : "translate-x-3"}`} />

                </div>
            </div>

            <AnimatePresence mode='wait'>
                {showSettingOps ?
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex flex-col gap-12 sm:gap-6 w-full h-[80%] mt-12 p-12 text-3xl sm:text-5xl font-[Inter] font-black"
                    >
                        {options.map(option => {
                            const Icon = option.icon

                            return <motion.div
                                variants={childVariants}
                                key={option.id}
                                onClick={handleClick} className="flex items-center gap-2 group "
                            >
                                <Icon size={35}></Icon>
                                <NavLink className={({isActive})=>`group-hover:text-white ${isActive ? "text-white" : "text-[#8E8E93]"}`} to={`/settings/${option.path}`}>{option.name}</NavLink>
                            </motion.div>
                        })}
                    </motion.div>
                    : null
                }
            </AnimatePresence>

        </motion.div>
    )
}

