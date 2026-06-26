import {  TbTagsOff } from "react-icons/tb";
import { LuTags } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { Input } from "../Input/Input";
import { motion, AnimatePresence } from "framer-motion";
import { MdRemoveCircleOutline } from "react-icons/md";
import { nanoid } from "@reduxjs/toolkit";
import { HelpHover } from "../HelpHover/HelpHover";


export function TagInput() {

    const [showTagInput, setShowTagInput] = useState(false)
    const [tagInputValue, setTagInputValue] = useState(null)
    const [tagError, setTagError] = useState(null)
    const inputRef = useRef(null)
    const [tags, setTags] = useState([
        { tag: '#d6termine', id: '#34534' },
    ])
    const tagColors = [
        "text-pink-400",
        "text-blue-400",
        "text-green-400",
        "text-yellow-400",
        "text-purple-400",
        "text-cyan-400",
        "text-orange-400",
    ];

    useEffect(() => {

        if (!showTagInput) return

        function clickOutside(e) {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowTagInput(false)
                setTagError(null)
            }
        }

        document.addEventListener('mousedown', clickOutside)

        return () => document.removeEventListener('mousedown', clickOutside)

    }, [showTagInput])

    function handleKeyDown(e) {
        if (e.key !== 'Enter' || !tagInputValue) return

        if (!tagInputValue.trim()) {
            setTagError("Tag cannot be empty.");
            return;
        }

        if (tags.length >= 5) return setTagError('Maximum 5 tags are allowed')


        e.preventDefault();

        setTags(pre => (
            [
                ...pre,
                {
                    tag: tagInputValue,
                    id: nanoid(8)
                }
            ]
        ))

        setTagInputValue('')
    }

    function handleRemoveTag(id, e) {
        e.stopPropagation();

        setTags(prev => {
            return prev.filter((tag) => {
                return tag.id !== id
            })
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <label className="flex items-center justify-center gap-2 font-[Inter]" htmlFor="tags">
                <span className="font-bold">Tags</span>

                <HelpHover
                    Info={'Tags help you quickly find and organize your links.'}
                />
            </label>


            <div
                onClick={() => setShowTagInput(true)}
                className="w-[80%] cursor-alias m-auto relative flex items-center gap-2 px-3 py-2 min-h-[48px] bg-zinc-900 border border-zinc-800 text-sm"
            >
                <LuTags className="text-zinc-400 text-lg" />

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <div
                            onClick={(e) => handleRemoveTag(tag.id, e)}
                            key={tag.id}
                            className={`${tagColors[index % tagColors.length]} group relative flex items-center px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-sm overflow-hidden`}
                        >
                            <span className="transition-opacity cursor-pointer duration-200 group-hover:opacity-0">
                                {tag.tag}
                            </span>

                            <TbTagsOff
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-0 scale-75 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 cursor-pointer "
                            />
                        </div>
                    ))}
                </div>
                <AnimatePresence>
                    {
                        showTagInput && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -10,
                                    scale: 0.95,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                    scale: 0.95,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                }}
                                ref={inputRef}
                                className="absolute left-0 top-[110%] w-full rounded-sm border border-zinc-800 bg-zinc-950 p-3 shadow-2xl z-50"
                            >
                                <Input

                                    placeholder="Add a tag..."
                                    value={tagInputValue}
                                    onChange={(e) => {
                                        if (e.target.value.length >= 20) {
                                            return setTagError('Tags cannot exceed 20 characters.')
                                        }
                                        setTagError(null)
                                        setTagInputValue(e.target.value)
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className="w-full h-10 cursor-text px-3 rounded-sm bg-zinc-900 border border-zinc-800 text-white"
                                >
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowTagInput(false);
                                            setTagError(false)
                                        }}
                                        className="absolute z-50 right-2 cursor-pointer"
                                    >
                                        <MdRemoveCircleOutline className="hover:text-red-500" />
                                    </div>
                                </Input>
                                {
                                    tagError && (
                                        <motion.p
                                            initial={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.95,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.95,
                                            }}
                                            transition={{
                                                duration: 0.2,
                                                ease: "easeOut",
                                            }}
                                            className="mt-1 text-xs text-red-400"
                                        >
                                            {tagError}
                                        </motion.p>
                                    )
                                }

                            </motion.div>
                        )
                    }
                </AnimatePresence>

            </div>
        </div >
    )
}

