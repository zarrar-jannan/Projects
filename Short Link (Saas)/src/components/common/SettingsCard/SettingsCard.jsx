

function SettingsCard({
    children,
    title,
    description,
    className="bg-[#17181c] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4"
}) {
    return (
        <div className={className}>
            <div>
                {
                    title && <h3
                        className="text-white font-[Inter] font-semibold text-[17px] xs:text-lg text-center"
                    >{title}</h3>
                }
                {
                    description && <p
                        className="text-gray-400 text-center font-[Ubuntu] text-[13px] xs:text-[15px]"
                    >{description}</p>
                }
            </div>

            <div className='flex flex-col gap-4 mt-2'>
                {children}
            </div>
        </div>
    )
}

export default SettingsCard