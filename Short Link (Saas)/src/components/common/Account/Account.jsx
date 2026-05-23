import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button/Button";
import { AuthService } from "../../../Appwrite/auth/auth";
import { Link, useNavigate } from "react-router";
import { logout } from "../../../store/authSlice";
import { MdVerified } from "react-icons/md";
import { PiSealWarningFill } from "react-icons/pi";
import { LuMailWarning } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";

export function Account() {

    const userInfo = useSelector((state) => state.authSlice.userInfo);
    const accountDisplay = userInfo?.name?.charAt(0)?.toUpperCase() || "U";
    const hoverTimeOut = useRef(null)

    const [showUserInfo, setShowUserInfo] = useState(false);
    const [error, setError] = useState(null);
    const [logoutLoading, setLogLoading] = useState(false);
    const [verifyWarning, setVerifyWarning] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authentication = new AuthService();

    function handleClick() {
        setShowUserInfo(true);
    }

    useEffect(() => {
        function clickOutSide(e) {
            if (!e.target.closest("#userInfo") && !e.target.closest("#userInfoBtn")) {
                setShowUserInfo(false);
            }
        }

        document.addEventListener("click", clickOutSide);

        return () => document.removeEventListener("click", clickOutSide);
    }, []);

    async function handleLogOut() {
        setLogLoading(true);

        try {
            await authentication.logOut();
            dispatch(logout());
            navigate("/");
        } catch (error) {
            setLogLoading(false);

            switch (error.code) {
                case 401:
                    setError(`session doesn't exist`);
                    break;

                default:
                    setError("logout failed");
                    break;
            }
        }
    }

    function handleMouseEnter() {
        hoverTimeOut.current && clearTimeout(hoverTimeOut.current)
        setVerifyWarning(true)
    }
    function handleMouseLeave() {
        hoverTimeOut.current = setTimeout(() => {
            setVerifyWarning(false)
        }, 200)
    }

    return (
        <div
            id="userInfoBtn"
            onClick={handleClick}
            className={`p-1 w-[30px] relative text-black font-[Inter] rounded-[3px] flex flex-col items-center justify-center bg-white`}
        >
            <p className="cursor-pointer">{accountDisplay}</p>

            {showUserInfo && (
                <div
                    id="userInfo"
                    className="absolute right-0 top-12 z-[500] w-72 rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl backdrop-blur-md"
                >
                    <div className="space-y-1 border-b border-zinc-800 pb-4">
                        <p className="text-sm text-zinc-400">Signed in as</p>
                        <h3 className="flex relative items-center gap-1.5 text-base font-semibold text-white">
                            <span>
                                {userInfo?.name}
                            </span>

                            <span className="text-[14px] p-0 m-0">
                                {userInfo?.is_verified ? (
                                    <span>
                                        <MdVerified></MdVerified>
                                    </span>
                                ) : (
                                    <span
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        className="text-red-600 cursor-help"
                                    >
                                        <PiSealWarningFill></PiSealWarningFill>
                                    </span>
                                )}
                            </span>

                            <AnimatePresence>
                                {verifyWarning && (
                                    <motion.span
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        className="flex flex-col absolute left-0 top-6 items-center justify-between gap-4 p-4 bg-[#1e1e1e] border border-zinc-800 rounded-xl"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-red-600">
                                                <LuMailWarning></LuMailWarning>
                                            </span>
                                            <p className="text-[12px] text-center font-[Inter] text-orange-200">
                                                Verify your identity to get full access to exclusive features.
                                            </p>
                                        </div>
                                        <Link
                                            to={'/settings/account'}
                                            className="text-sm font-bold text-white hover:text-gray-200 underline underline-offset-4 transition-all"
                                        >
                                            Get Verified
                                        </Link>
                                    </motion.span>
                                )}
                            </AnimatePresence>


                        </h3>
                        <p className="truncate text-sm text-zinc-500">
                            {userInfo?.email}
                        </p>
                    </div>

                    {error && (
                        <p className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <Button
                        onClick={handleLogOut}
                        loadingText={logoutLoading && 'Logging out...'}
                        className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        Logout
                    </Button>
                </div>
            )}
        </div>
    )
}
