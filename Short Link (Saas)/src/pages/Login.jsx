import { Link, useNavigate } from "react-router"
import { Input } from "../components/common/Input/Input"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AuthService } from "../Appwrite/auth/auth"
import { DatabaseService } from "../Appwrite/config/databaseService/database"
import { Button } from "../components/common/Button/Button"
import { login } from '../store/authSlice'



function Login() {

  const [formData, setFormData] = useState({
    password: '',
    email: ''
  })

  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authentication = new AuthService()
  const database = new DatabaseService()
  const [loading, setLoading] = useState(false)



  function handleChange(e) {
    const { name, value } = e.target;
    setError(null)

    setFormData(data => ({
      ...data,
      [name]: value,
    }))
  }


  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('please enter valid login credentials.')
      return
    }

    if (formData.password.length < 8) {
      setError('password must be atleast 8 characters.')
      return
    }

    setLoading(true)

    try {
      const session = await authentication.loginUser(formData);

      if (session) {
        const authInfo = await authentication.getUserData()

        if (authInfo) {
          const userInfo = await database.getUser({ userId: authInfo.$id });

          dispatch(login({
            $id: userInfo.$id,
            name: userInfo.full_name,
            bio: userInfo.bio,
            email: userInfo.email,
            location: userInfo.location,
            avatar_file_id: userInfo.avatar_file_id,
            plan: userInfo.plan,
            is_verified: userInfo.is_verified,
            role: userInfo.role,
            total_links: userInfo.total_links,
          }));
          navigate('/')
        }
      }

    } catch (error) {

      setLoading(false)

      switch (error.code) {
        case 401:
          setError('Invalid credentials.')
          break;
        case 429:
          setError('Too many login attempts.')
          break;
        default:
          setError('Something went wrong.')
          break;
      }
    }


  }

  async function handleAuthGoogle() {
    try {
      await authentication.authWithGoogle()

    } catch (error) {
      return
    }
  }


  return (
    <form onSubmit={handleSubmit} className='flex items-center justify-center w-full h-[100vh] bg-black'>
      <div className='flex flex-col items-center gap-12 justify-center w-100 p-10 text-[#09090b] border-[0.5px] border-[#25252a]'>
        <div className="flex flex-col text-center items-center justify-center text-white">
          <h4 className="font-[Ubuntu] text-2xl">Log in to Continue</h4>
          <p className="text-[#86868e] text-[14px] sm:text-[16px] font-[Inter]">Don,t have an account? <Link to={'/sign-up'} className="font-[Inter] hover:underline text-white">Sign up</Link> </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <div onClick={handleAuthGoogle} className="flex items-center justify-center w-[100%] border-[0.4px] border-[#25252a] bg-[#141416] hover:bg-[#3b3b40] items-center justify-center gap-2 cursor-pointer">
            <img className="w-[30px]" src="/images/google-icon.png" />
            <p className="text-white font-[Inter]">Login with Google</p>
          </div>
        </div>

        <div className=" flex flex-col gap-2 text-white font-[Inter] w-full">
          <Input
            type={'email'}
            label={'EMAIL'}
            placeholder="you@example.com"
            className="bg-[#171719] p-1.5 w-full text-[15px]"
            value={formData.email}
            onChange={handleChange}
            name="email"
          />
          <Input
            type={'password'}
            label={'PASSWORD'}
            placeholder="mypass#123"
            className="bg-[#171719] p-1.5  w-full text-[15px]"
            value={formData.password}
            onChange={handleChange}
            name="password"
          />
          <Link className="font-[Ubuntu] text-[16px] hover:underline" to={'/reset-password'}>Forget?</Link>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          {
            error && <p className="text-red-500 mb-3 font-[Inter]">{error}</p>
          }

          <Button loadingText={loading && 'Logging in...'} type="submit" className="bg-white w-full cursor-pointer text-black font-[Ubuntu] p-1 hover:bg-[#acacb0]">Log in</Button>
        </div>

      </div>
    </form>
  )
}

export default Login