import SettingsCard from "../../components/common/SettingsCard/SettingsCard"
import { Input } from "../../components/common/Input/Input"
import { Button } from '../../components/common/Button/Button'
import { AuthService } from "../../Appwrite/auth/auth"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../../store/authSlice"
import { sendVerificationCode } from "../../utils/emailVerify"
import { GrLinkNext } from "react-icons/gr";
import { Loading } from "../../components/common/Loading/Loading"
import { DatabaseService } from "../../Appwrite/config/databaseService/database"
import { AnimatePresence, motion } from "framer-motion"
import { IoClose } from "react-icons/io5";
import { PiSealWarningFill } from "react-icons/pi";
import { MdVerified } from "react-icons/md";


export function AccountSettings() {

  const [password, setPassword] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [updateEmailInputs, setUpdateEmailInputs] = useState({
    new_email: "",
    password: "",
  })
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState(null)

  const [expireTimeLeft, setExpireTimeLeft] = useState(60 * 15);
  const mins = Math.floor(expireTimeLeft / 60)
  const seconds = (expireTimeLeft % 60).toString().padStart(2, '0')
  const [reVerificationWarning,setReVerificationWarn] = useState(true)


  const [passwordError, setPasswordError] = useState(null)
  const [PassUpdateSuccess, setPassUpdSuccess] = useState(null)
  const [passwordLoading, setPassLoading] = useState(false)

  const [updateEmailError, setUpdateEmailError] = useState(null);
  const [updateEmailSuccess, setUpdateEmailSuccess] = useState(null)
  const [updateEmailLoading, setUpdateEmailLoading] = useState(null)

  const [VerificationCodeError, setVerificationCodeError] = useState(null)
  const [VerificationCodeLoading, setVerificationCodeLoading] = useState(false)

  const [showOTPInput, setShowOTPInput] = useState(false)
  const [emailVerifyError, setEmailVerifyError] = useState(null)
  const [emailVerifySuccess, setEmailVerifySuccess] = useState(null)
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false)

  const authentication = new AuthService()
  const database = new DatabaseService()
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.authSlice.userInfo);



  useEffect(() => {
    if (!showOTPInput) return
    if (expireTimeLeft <= 0) return;

    const interval = setTimeout(() => {
      setExpireTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTimeLeft, showOTPInput])



  function handlePassword(e) {
    const { name, value } = e.target;
    setPasswordError(null)

    setPassword({
      ...password,
      [name]: value
    })

  }

  function handleVerification(e) {
    const { value } = e.target;

    setVerificationEmail(value)

  }

  function handleCode(e) {
    const { value } = e.target;
    setEmailVerifyError(null)
    setEmailVerifySuccess(null)

    if (value < 999999) {
      setVerificationCode(value)
    }

  }

  function handleUpdateEmail(e) {
    const { name, value } = e.target;
    setUpdateEmailError(null)
    setUpdateEmailSuccess(null)

    setUpdateEmailInputs({
      ...updateEmailInputs,
      [name]: value,
    })
  }

  async function changeEmail(e) {
    e.preventDefault()
    setUpdateEmailLoading(true)

    try {
      const res = await authentication.updateEmail({
        userId: userInfo.$id,
        password: updateEmailInputs.password,
        email: updateEmailInputs.new_email,
      })

      if (res) {
        dispatch(updateUser({
          ...userInfo,
          email: updateEmailInputs.new_email,
          is_verified: false,
        }))
        return setUpdateEmailSuccess('Email address updated successfully.')
      }

    } catch (error) {
      console.log(error, error.code);

      switch (error.code) {
        case 400:
          setUpdateEmailError('Invalid email address. Please check and try again.')
          break;
        case 401:
          setUpdateEmailError('The password you entered is incorrect.')
          break;
        case 409:
          setUpdateEmailError('This email is already in use.')
          break;
        default:
          setUpdateEmailError('Something went wrong..')
          break;
      }
    } finally {
      setUpdateEmailLoading(false)
    }
  }

  async function changePassword() {
    const { current_password, new_password, confirm_password } = password;

    if (new_password !== confirm_password)
      return setPasswordError('Passwords do not match.')

    setPassLoading(true)

    try {
      const res = await authentication.updatePassword({
        oldPassword: current_password,
        password: new_password,
      })

      if (res) setPassUpdSuccess('Success! Your password has been changed.')
    } catch (error) {
      console.log(error, `       ${error.code}`);

      switch (error.code) {
        case 400:
          setPasswordError('Invalid password format.')
          break;
        case 401:
          setPasswordError('The current password you entered is incorrect.')
          break;
        case 400:
          setPasswordError('Invalid password format.')
          break;

        default:
          setPasswordError('Something went wrong.')
          break;
      }

    } finally {
      setPassLoading(false)
    }

  }

  async function handleGetVerified() {

    if (!verificationCode) return setEmailVerifyError('Please enter your OTP.')

    setEmailVerifyLoading(true)
    setEmailVerifyError(null)
    setEmailVerifySuccess(null)

    try {
      const verificationData = await database.getUser({ userId: userInfo.$id });

      console.log(verificationData);

      if (verificationData.verification_expires <= Date.now()) {
        return setEmailVerifyError('OTP has expired. Please request a new one.')
      }

      if (verificationData.verification_code == verificationCode) {

        const updt = await database.updateUser({
          userId: userInfo.$id,
          data: {
            is_verified: true,
          }
        })
        setEmailVerifySuccess(true)

        if (updt) {
          setEmailVerifySuccess(true)
          dispatch(updateUser({
            ...userInfo,
            is_verified: true,
          }))
        }
      }
      else {
        setEmailVerifyError('Invalid OTP code. Please try again.')
      }

    } catch (error) {
      console.log(error, error.code);
      setEmailVerifyError('error occured')
    }
    finally {
      setEmailVerifyLoading(false)
    }

  }

  async function sendVerification() {

    if (userInfo.is_verified) return setVerificationCodeError('This account is already verified.')
    if (userInfo?.email !== verificationEmail) return setVerificationCodeError('Please use your current email.')

    setVerificationCodeLoading(true)
    setEmailVerifyError(null)
    setEmailVerifySuccess(null)

    try {
      const res = await sendVerificationCode({
        userEmail: verificationEmail,
        userId: userInfo.$id
      })

      if (res) {
        setShowOTPInput(true)
      }

    } catch (error) {
      console.log(error, 'verification error');
      setVerificationCodeError('error occured.')
    } finally {
      setVerificationCodeLoading(false)
    }
  }

  function handleShowOTPInput() {

    if (userInfo?.is_verified) return setVerificationCodeError('This account is already verified.')

    setExpireTimeLeft(15 * 60);
    setVerificationCode(null)
    setEmailVerifyError(null)
    setEmailVerifySuccess(null)
    setShowOTPInput(!showOTPInput)
  }


  return (
    <div className="dash-scroll flex flex-col items-center p-6 sm:p-12 w-full h-[calc(100vh-40px)] overflow-auto ">

      <div className="w-full flex flex-col justify-center items-center text-center">
        <h2 className="text-[25px] tsm:text-[42px] font-[Ubuntu]" >Account Settings</h2>
        <p className="text-[13px] sm:text-[17px] ">Manage your account details, verify your identity, and keep your security settings up to date.</p>
      </div>

      <div className="w-full flex flex-col lg:flex-row p-2 mt-12 gap-12 justify-center items-center">
        <SettingsCard
          title={'Secure your Account'}
          description={'Update your password to keep your account protected.'}
          className="bg-[#17181c] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 w-full sm:max-w-md"
        >
          <Input
            placeholder="Current Password"
            value={password.current_password}
            name="current_password"
            onChange={handlePassword}
            type="password"
            className="w-full p-2 xs:p-3 rounded-lg"
          />

          <Input
            placeholder="New Password"
            value={password.new_password}
            name="new_password"
            onChange={handlePassword}
            type="text"
            className="w-full p-2 xs:p-3 rounded-lg"
          />

          <Input
            placeholder="Confirm Password"
            value={password.confirm_password}
            name="confirm_password"
            onChange={handlePassword}
            type="text"
            className="w-full p-2 xs:p-3 rounded-lg"
          />

          {
            passwordError && <p className="text-red-500 text-center font-[Inter]">{passwordError}</p>
          }
          {
            PassUpdateSuccess && <p className="text-green-500 text-center font-[Inter]">{PassUpdateSuccess}</p>
          }

          <Button
            loadingText={passwordLoading && 'Updating...'}
            onClick={changePassword}
            className="mt-2 w-full py-2 xs:py-3 text-[14px] xs:text-[16px] font-[Inter] bg-blue-600 hover:bg-blue-800 transition-al rounded-lg"
          >
            Change Password
          </Button>
        </SettingsCard>

        <SettingsCard
          title={'Email Verification'}
          description={'Verify your email to unlock exclusive features and updates.'}
          className="bg-[#17181c] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 w-full sm:max-w-md"
        >
          <Input
            placeholder="Your Email."
            value={verificationEmail}
            name={'verification_email'}
            onChange={handleVerification}
            type="email"
            className="w-full p-2 xs:p-3 rounded-lg"
          />

          {
            VerificationCodeError && <p className="text-red-500 text-center font-[Inter]">{VerificationCodeError}</p>
          }

          <div className="flex justify-center items-center font-[Inter] text-[#bfc0c4] w-full h-full">
            <button
              onClick={handleShowOTPInput}
              className="cursor-pointer hover:underline"
            >Already requested a code?</button>
          </div>

          <Button
            onClick={sendVerification}
            loadingText={VerificationCodeLoading && 'Sending...'}
            className="mt-2 w-full py-2 xs:py-3 text-[14px] xs:text-[16px] font-[Inter] bg-blue-600 hover:bg-blue-800 transition-all rounded-lg"
          >
            Send a Link
          </Button>
        </SettingsCard>

      </div>

      <AnimatePresence>
        {
          showOTPInput && (
            <div className="fixed z-[100] left-0 top-0 w-full h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full absolute z-[60] bg-black/40 backdrop-blur-sm "
              />

              <div
                onClick={() => setShowOTPInput(false)}
                className="absolute z-[70] right-10 top-10 cursor-pointer text-white text-3xl hover:text-gray-300"
              >
                <IoClose></IoClose>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="absolute z-[70] flex flex-col items-center justify-center gap-4 left-1/2 top-1/2 -translate-1/2"
              >
                <p className="text-[13px] text-zinc-500 font-[Inter]">
                  Enter the 6-digit code sent to your email
                </p>

                <motion.div className="flex">
                  <Input
                    className={`${emailVerifyError && 'text-red-600'} ${emailVerifySuccess && 'cursor-not-allowed'} font-[Inter] font-bold text-2xl bg-[#181818] text-center w-[200px] p-3 outline-none`}
                    type={'number'}
                    value={verificationCode}
                    onChange={handleCode}
                    placeholder="OTP CODE"
                  ></Input>


                  <Button
                    onClick={handleGetVerified}
                    className={`flex justify-center text-2xl items-center font-[Ubuntu]  py-4 px-4 hover:bg-[#181818] text-white font-black transition-all active:scale-95 uppercase tracking-[1px] shadow-2xl shadow-white/5`}
                  >
                    {
                      emailVerifyLoading ? <Loading /> : <GrLinkNext />
                    }


                  </Button>

                </motion.div>

                {
                  emailVerifyError && <p className="text-red-500 text-center font-[Inter]">{emailVerifyError}</p>
                }
                {
                  emailVerifySuccess ?
                    (
                      <motion.div
                        initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        className="flex justify-center items-center gap-2 text-center font-[Inter]"
                      >
                        <p className="text-green-500 ">
                          Account status updated for
                        </p>
                        <span className="flex items-center justify-center text-white font-semibold flex">
                          <span>
                            {userInfo?.name}
                          </span>

                          <span className="relative w-8 h-8 overflow-hidden inline-block">
                            <motion.span
                              initial={{ y: 0 }}
                              animate={{ y: -40 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.5,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <PiSealWarningFill color="red" />
                            </motion.span>

                            <motion.span
                              initial={{ y: 40 }}
                              animate={{ y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.5,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <MdVerified />
                            </motion.span>
                          </span>
                        </span>
                      </motion.div>
                    )
                    : (
                      <AnimatePresence mode="wait">
                        <motion.div
                          initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          className="flex items-center justify-center"
                        >
                          <p className="font-[Ubuntu] text-sm sm:text-base font-medium text-yellow-400 bg-[#17181c] px-4 py-2 tracking-wider shadow-md">
                            {mins}:{seconds}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    )
                }
              </motion.div>
            </div>
          )
        }
      </AnimatePresence>

      <div className="mt-10">
        <SettingsCard
          title={'Change Email'}
          description={'Enter your new email address and confirm your password to make this change.'}
          className="bg-[#17181c] relative border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 w-full sm:max-w-md"
        >

          {
            reVerificationWarning && (<div className="bg-[#121316] border text-center border-zinc-800 rounded-xl p-4 flex flex-col gap-3 transition-all">
              <p className="text-zinc-400 leading-relaxed">
                <span className="text-amber-500 font-bold uppercase mr-1.5 tracking-wider ">Note:</span>
                Changing your email address will require re-verification.
              </p>
              <button
                type="button"
                onClick={()=>setReVerificationWarn(false)}
                className=" px-4 py-1.5 cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-[11px] rounded-md transition-colors uppercase tracking-wider"
              >
                OK
              </button>
            </div>)}

          <Input
            placeholder="New Email"
            type="email"
            value={updateEmailInputs.new_email}
            onChange={handleUpdateEmail}
            name="new_email"
            className="w-full p-2 xs:p-3 rounded-lg"
          />
          <Input
            placeholder="Your Password"
            type="password"
            value={updateEmailInputs.password}
            onChange={handleUpdateEmail}
            name="password"
            className="w-full p-2 xs:p-3 rounded-lg"
          />

          {
            updateEmailError && <p className="text-red-500 text-center font-[Inter]">{updateEmailError}</p>
          }
          {
            updateEmailSuccess && <p className="text-green-500 text-center font-[Inter]">{updateEmailSuccess}</p>
          }

          <Button
            onClick={changeEmail}
            loadingText={updateEmailLoading && 'Updating...'}
            className="mt-2 w-full py-2 xs:py-3 text-[14px] xs:text-[16px] font-[Inter] bg-blue-600 hover:bg-blue-800 transition-all rounded-lg"
          >
            Save Changes
          </Button>
        </SettingsCard>
      </div>

      <div className="cursor-pointer font-[Ubuntu] mt-12">
        <Link to={'/reset-password'}>Don,t know your old password?</Link>
      </div>

    </div>
  )
}
