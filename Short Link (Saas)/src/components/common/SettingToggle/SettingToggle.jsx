import { motion, AnimatePresence } from "framer-motion";



export function SettingToggle({ children, onToggle, value, title, description }) {
    return (
        <div className="rounded-sm border border-zinc-800 bg-zinc-900">

 
    <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-col items-start">
            <h4 className="font-medium text-zinc-200">
                {title}
            </h4>

            <p className="text-xs text-zinc-500">
                {description}
            </p>
        </div>

        <div
            onClick={onToggle}
            className={`h-6 w-11 flex rounded-full p-1 cursor-pointer bg-zinc-700 ${
                value ? "justify-end" : "justify-start"
            }`}
        >
            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
                className="h-4 w-4 rounded-full bg-white"
            />
        </div>
    </div>

    <AnimatePresence>
        {value && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className=" border-t border-zinc-800"
            >
                <div className="p-4">
                    {children}
                </div>
            </motion.div>
        )}
    </AnimatePresence>

</div>
    )
}
