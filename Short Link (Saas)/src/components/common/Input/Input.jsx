import { useId } from "react"

export function Input({
    label = '',
    labelIcon,
    type,
    placeholder = '',
    labelClasses = "font-[Ubuntu] font-semibold",
    className = 'text-black',
    ...props
}) {

    const id = useId()

    return (
        <div className="flex flex-col justify-center gap-1">
            {label && <label className={labelClasses} htmlFor={id}>
                <span className="md:hidden">{labelIcon || label}</span>
                <span className="hidden md:inline">{label}</span>
            </label>}
            <input className={className} id={id} type={type} placeholder={placeholder} {...props} />
        </div>
    )
}
