import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../common/Input/Input";
import { Button } from "../../common/Button/Button";
import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { TagInput } from "../../common/TagInput/TagInput";
import { SettingToggle } from "../../common/SettingToggle/SettingToggle";
import { TbLockPassword, TbClockPlay } from "react-icons/tb";
import { PiCursorClickDuotone } from "react-icons/pi";
import { HelpHover } from "../../common/HelpHover/HelpHover";










function CreateModal({ setShowCreateModal }) {


  const [step, setStep] = useState(1)
  const [tags, setTags] = useState([])

  const [passwordProtection, setPassProtection] = useState(false)
  const [password, setPassword] = useState(null)

  const [oneTimeUse, setOneTimeUse] = useState(false)
  const [howManyClicks, setHowManyClicks] = useState(1)

  const [isLinkActive, setActiveLink] = useState(true)

  const STEPS = {
    1: {
      title: "Create New Link",
      description:
        "Enter the destination URL and customize your short link.",
    },

    2: {
      title: "Advanced Settings",
      description:
        "Secure and control your link with passwords, expiration rules, and usage limits.",
    },

    3: {
      title: "Review & Create",
      description:
        "Review all settings and create your link.",
    },
  };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={() => setShowCreateModal(false)}
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="custom-scrollbar relative flex flex-col gap-8 w-[924px] h-[480px] bg-zinc-950 border border-zinc-800 p-8 shadow-2xl overflow-auto"
      >
        <AnimatePresence mode="wait">
          <div className="flex justify-center items-start w-full relative">

            {
              step > 1 && (
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  exit={{
                    scale: 0,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="absolute z-[1000] left-0 top-2">
                  <IoArrowBackCircleOutline
                    onClick={() => setStep(p => p - 1)}
                    className="text-white text-2xl cursor-pointer hover:text-zinc-300 hover:scale-110 transition-all duration-200"
                  />
                </motion.div>
              )
            }

            <motion.div
              key={step}
              initial={{
                opacity: 0,
                filter: "blur(8px)",
                y: 5,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              }}
              exit={{
                opacity: 0,
                filter: "blur(8px)",
                y: -5,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <h2 className="text-2xl font-bold text-white">
                {STEPS[step].title}
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                {STEPS[step].description}
              </p>
            </motion.div>
          </div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {
            step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex flex-col gap-6">
                  <Input
                    className="w-[80%] m-auto justify-start h-10 px-3 rounded-sm font-[Inter] bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-600 transition-all duration-200"
                    label="Destination URL"
                    labelClasses="font-[Inter]"
                    type="url"
                    placeholder="https://your-long-example-url.com"
                  />
                  <div className="flex items-center w-[80%] m-auto overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">

                    <input
                      type="url"
                      value="localhost:5173/"
                      readOnly
                      className="w-[180px] h-10 px-3 bg-zinc-950 text-zinc-400 border-r border-zinc-800 outline-none cursor-default"
                    />

                    <Input
                      className="w-full h-10 px-3 bg-transparent border-none text-white placeholder:text-zinc-500 outline-none focus:ring-0"
                      type="text"
                      placeholder="my-business (optional)"
                    />
                  </div>
                </div>


                <div className="border-t border-zinc-800 mt-5 pt-6">
                  <h3 className="text-sm font-medium text-white">
                    Link Visibility
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Choose whether your link can appear in public discovery pages.
                  </p>

                  <div className="mt-4 flex justify-center gap-8">
                    <label className="flex items-center gap-2 text-zinc-300">
                      <Input
                        type="radio"
                        name="visibility"
                        id="public"
                        className="accent-red-500"
                        defaultChecked
                      />
                      Public
                    </label>

                    <label className="flex items-center gap-2 text-zinc-300">
                      <Input
                        type="radio"
                        name="visibility"
                        id="private"
                        className="accent-red-500"
                      />
                      Privates
                    </label>
                  </div>
                  <div className="flex justify-end p-2 ">
                    <Button
                      onClick={() => setStep(2)}
                      className="p-2 w-[90px] rounded-lg font-[Montserrat] bg-white text-black font-semibold text-sm transition-all duration-200 hover:scale-[0.98] hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-lg"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          }

          {
            step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col gap-5">
                  <Input
                    label="Link Title"
                    placeholder="e.g. Company Website"
                    className="w-[80%] mx-auto h-11 px-4 rounded-sm bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-red-500 transition-all duration-200"
                    labelClasses="w-[80%] mx-auto font-[Manrope] font-semibold text-zinc-200 "
                  />

                  <TagInput />

                </div>

                <div className="w-[80%] mx-auto mt-6 space-y-4">

                  {/* Password Protection */}

                  <SettingToggle
                    title={'Password Protection'}
                    description={'Require a password before accessing the link'}
                    value={passwordProtection}
                    onToggle={() => setPassProtection(p => !p)}
                  >
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        mainClasses="w-[80%]"
                        placeholder="Create a password required to access this link..."
                        className="flex h-11 px-4 rounded-sm border font-[Inter] text-[13px] border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                      >
                      </Input>

                      <button
                        className="h-11 w-11 shrink-0 cursor-pointer flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200"
                      >
                        <TbLockPassword className="text-lg" />
                      </button>
                    </div>
                  </SettingToggle>

                  {/* One Time Use */}

                  <SettingToggle
                    title={'One-Time Use'}
                    onToggle={() => setOneTimeUse(p => !p)}
                    value={oneTimeUse}
                    description={'Disable the link after its first visit'}
                  >
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={howManyClicks}
                        mainClasses="w-[80%]"

                        placeholder="Choose how many times your link can be accessed..."
                        className="flex-1 h-11 px-4 rounded-sm border font-[Inter] text-[14px] border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                      >
                      </Input>

                      <button
                        className="h-11 w-11 shrink-0 cursor-pointer flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200"
                      >
                        <PiCursorClickDuotone />
                      </button>
                    </div>
                  </SettingToggle>

                  {/* Active Status */}

                  <SettingToggle
                    title={'Active Link'}
                    description={'Enable or disable this link'}
                    onToggle={() => setActiveLink(p => !p)}
                    value={isLinkActive}
                  >
                    <div className="justify-self-start mb-2 flex items-center justify-center gap-2">
                      <p className="text-xs text-zinc-400">
                        When should this link stop working?
                      </p>
                      <HelpHover
                        size={16}
                        Info={'Set an expiry date for your link. Leave this field blank if you want the link to remain active indefinitely.'}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="date"
                        mainClasses="w-[80%]"
                        placeholder="Choose how many times your link can be accessed..."
                        className="flex-1 h-11 px-4 rounded-sm border font-[Inter] text-[14px] border-zinc-800 bg-zinc-900 text-white placeholder:text-white"
                      >
                      </Input>

                      <button
                        className="h-11 w-11 shrink-0 cursor-pointer flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200"
                      >
                        <TbClockPlay></TbClockPlay>
                      </button>
                    </div>
                  </SettingToggle>


                </div>

                <div className="flex items-center justify-end w-full mt-5">
                  <Button
                    className="h-11 px-6 rounded-lg bg-white text-black font-medium tracking-wide transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98]"
                  >
                    CREATE YOUR LINK
                  </Button>
                </div>
              </motion.div>
            )
          }
        </AnimatePresence>

      </motion.div>
    </motion.div >
  );
}


export default CreateModal