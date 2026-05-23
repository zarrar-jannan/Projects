import { useDispatch, useSelector } from "react-redux"
import { Button } from "../../components/common/Button/Button";
import { LuTrash2 } from "react-icons/lu";
import { BiUndo } from "react-icons/bi";
import { TbFileUpload, TbHttpDelete } from "react-icons/tb"
import { Input } from "../../components/common/Input/Input";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageCropper } from "../../components/common/ImageCropper/ImageCropper";
import { StorageService } from "../../Appwrite/config/storageService/storage";
import { DatabaseService } from "../../Appwrite/config/databaseService/database";
import { updateUser } from "../../store/authSlice";
import { Link } from "react-router";
import { AuthService } from "../../Appwrite/auth/auth";

export function ProfileSettings() {

    const userInfo = useSelector(state => state.authSlice.userInfo);
    const [error, setError] = useState(null)
    const [profile, setProfile] = useState(null)
    const [confirmPopUp, setConfirmPopUp] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [successUpdate, setSuccessUpdate] = useState(null)
    const [updateError, setUpdError] = useState(null)

    const [name, setName] = useState(userInfo?.name || '')
    const [location, setLocation] = useState(userInfo?.location || '')
    const [bio, setBio] = useState(userInfo.bio || '')
    const maxBio = 150

    const storage = new StorageService()
    const authentication = new AuthService()
    const database = new DatabaseService()
    const dispatch = useDispatch()


    function handleProfile(e) {
        const file = e.target.files[0]

        if (!file) return;

        const imageUrl = URL.createObjectURL(file)

        setProfile(imageUrl)


    }

    function handleBio(e) {
        const { value } = e.target;

        if (value.length <= maxBio) {
            setBio(value)
        }


    }


    function handleCancel() {
        setProfile(null)
    }


    async function handleDelete() {
        if (!userInfo.avatar_file_id) {
            setError("You don't have an avatar to delete.")
            return
        }

        await storage.deleteAvatarFile({ fileId: userInfo.avatar_file_id })
        dispatch(updateUser({
            ...userInfo,
            avatar_file_id: null,
        }))
        setConfirmPopUp(false)

    }

    async function handleDone(imgFile) {

        if (!imgFile) return

        //UPLOAD AVATAR FILE
        const oldFileId = userInfo.avatar_file_id
        const res = await storage.uploadAvatar(imgFile)
        const newFileId = res.$id

        if (res) {
            //UPDATE DB-ID
            await database.updateUser({
                userId: userInfo.$id,
                data: { avatar_file_id: newFileId }
            })

            // UPDATE REDUX STATE
            dispatch(updateUser({
                ...userInfo,
                avatar_file_id: newFileId,
            }))
            setProfile(null)

            // DELETE OLD FILE ID 
            if (oldFileId) {
                try {
                    await storage.deleteAvatarFile({ fileId: oldFileId })
                } catch (error) {
                    console.log('error old file could,nt be deleted!', error);

                }
            }


        }
    }

    async function handleUpdate() {
        setUpdateLoading(true)

        try {
            if (name !== userInfo?.name) {
                await authentication.updateUsername({
                    userId: userInfo?.$id,
                    username: name,
                })
            }

            if (location !== userInfo.location) {
                await database.updateUser({
                    userId: userInfo?.$id,
                    data: {
                        location,
                    }
                })
            }

            if (bio !== userInfo.bio) {
                await database.updateUser({
                    userId: userInfo?.$id,
                    data: {
                        bio,
                    }
                })
            }

            dispatch(updateUser({
                ...userInfo,
                location,
                bio,
                name,
            }))
            setSuccessUpdate("Profile updated successfully!")

        } catch (error) {
            setUpdError('Sorry, we could,nt update your profile.')
        }
        finally {
            setUpdateLoading(false)
        }
    }



    useEffect(() => {
        return () => {
            if (profile) {
                URL.revokeObjectURL(profile)
            }
        }
    }, [profile])



    if (!userInfo) return 'Something went wrong!'
    return (
        <div className="dash-scroll flex flex-col gap-5 items-center justify-start p-6 md:p-12 bg-black w-full h-[calc(100vh-40px)] overflow-y-scroll">

            <AnimatePresence>
                {
                    error && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50"
                        >
                            <div className="w-60 sm:w-80 p-3 sm:p-6 bg-[#17181c] rounded-2xl shadow-2xl text-center">
                                <div className="text-red-500 text-3xl sm:text-4xl mb-4">!</div>
                                <h3 className="text-white text-[15px] sm:text-xl font-semibold mb-2">Ooops!</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    You don't have an avatar to delete.
                                </p>
                                <button onClick={() => setError(null)} className="w-full py-2 sm:py-3 bg-[#22282d] hover:bg-gray-700 cursor-pointer text-white font-medium rounded-xl transition-all">
                                    Got It
                                </button>
                            </div>
                        </motion.div>
                    )
                }

            </AnimatePresence>

            <div className="w-full md:w-[80%] p-2 mt-10 flex gap-2 flex-col justify-start">
                <h2 className="font-[Geist] text-white text-4xl sm:text-4xl">Profile Settings</h2>
                <p className="font-[Inter] text-[14px] sm:text-[14px]">Manage your profile settings and customize your identity.</p>
            </div>

            <div className="w-full md:w-[80%] flex flex-col items-start justify-center">

                <div className="w-full flex items-center gap-12 p-6 ">
                    <div className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:w-[130px] md:h-[130px] shrink-0 flex justify-center items-center rounded-[50%] overflow-hidden ">

                        <img
                            draggable="false"
                            className="w-full h-full object-cover object-center select-none"
                            src={userInfo.avatar_file_id ? (
                                storage.getAvatarPreview(userInfo.avatar_file_id)
                            ) : '/images/no-profile-pic.jpg'}
                            alt="profile.pic"
                        />

                    </div>
                    {
                        confirmPopUp ? (
                            <div className="flex items-center justify-center gap-5">
                                <Button onClick={() => setConfirmPopUp(false)} className="bg-white text-green-400 p-3 text-[15px] md:text-[20px] rounded-xl cursor-pointer hover:text-white hover:bg-green-500 transition-all"> <BiUndo></BiUndo> </Button>
                                <Button onClick={handleDelete} className="bg-white text-red-600 p-3 text-[15px] md:text-[20px] rounded-xl cursor-pointer hover:text-white hover:bg-red-600 transition-all"> <TbHttpDelete></TbHttpDelete> </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-5">
                                <Input
                                    onChange={handleProfile}
                                    type={'file'}
                                    labelClasses="bg-white md:bg-[#fedd4d] text-green-500 md:text-black font-[Inter] text-[16px] font-medium rounded-xl p-3 cursor-pointer hover:bg-[#e3bd17]"
                                    label={'Upload an avatar'}
                                    labelIcon={<TbFileUpload />}
                                    className="text-white hidden"
                                ></Input>
                                <Button onClick={() => setConfirmPopUp(true)} className="bg-white text-red-600 p-3 text-[15px] md:text-[20px] rounded-xl cursor-pointer hover:text-white hover:bg-red-600 transition-all"><LuTrash2></LuTrash2></Button>
                            </div>
                        )
                    }

                </div>
            </div>

            <div className="w-full md:w-[80%] p-6 flex flex-col gap-5">
                <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type={'text'}
                    className="text-white p-1.5 font-[Inter]"
                    placeholder={'Enter a Name'}
                ></Input>
                <Input
                    label="Location"
                    type={'text'}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-white p-1.5 font-[Inter]"
                    placeholder={'Enter Location'}
                ></Input>
                <div className="flex flex-col p-1">
                    <div className="flex items-center justify-between w-full">
                        <label className="font-[Ubuntu] font-semibold" htmlFor="bio">Bio</label>
                        <p className="font-[Inter] text-[12px] sm:text-[14px]">{`${bio.length}/${maxBio}`}</p>
                    </div>
                    <textarea
                        className="font-[Inter] p-2"
                        value={bio}
                        onChange={handleBio}
                        placeholder="Brief description for your profile."
                        name="bio"
                        id="bio"
                    ></textarea>
                </div>

                {
                    updateError && <p className="text-red-500 p-3 font-[Inter]">{updateError}</p>
                }
                {
                    successUpdate && <p className="text-green-400 p-3 font-[Inter]">{successUpdate}</p>
                }

                <div className="flex justify-center sm:justify-end w-full p-4">
                    <Button
                        onClick={handleUpdate}
                        loadingText={updateLoading && 'Updating...'}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-[Inter] text-[14px] sm:text-[16px] font-medium px-6 sm:px-8 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >Update</Button>
                </div>
            </div>

            <div className="cursor-pointer text-[13px] sm:text-[16px] font-[Ubuntu]">
                <Link to={'/settings/account'}>Looking for password change?</Link>
            </div>

            {profile && <ImageCropper onDone={handleDone} onClose={handleCancel} image={profile}></ImageCropper>
            }

        </div>
    )
}

