import { Link, useNavigate } from "react-router"
import { Input } from "../components/common/Input/Input"
import { useState } from "react"
import { Button } from "../components/common/Button/Button"
import { AuthService } from "../Appwrite/auth/auth"
import { useDispatch } from "react-redux"
import { login } from "../store/authSlice"


export function SignUp() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState(null)
  const authentication = new AuthService();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

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

    if (!formData.email.trim() || !formData.password.trim() || !formData.username.trim()) {
      setError('please enter valid login credentials.')
      return
    }

    if (formData.password.length < 8) {
      setError('password must be atleast 8 characters.')
      return
    }

    setLoading(true)

    

    try {
      const session = await authentication.createAccount(formData);

      if (session) {
        const userInfo = await authentication.getUserData()

        if (userInfo) {

          dispatch(
            login({
              $id: userInfo.$id,
              name: userInfo.name,
              email: userInfo.email,
              emailVerification: userInfo.emailVerification,
              prefs: userInfo.prefs,
            })
          );
          navigate('/')
        }

      }


    } catch (error) {

      
      setLoading(false)

      switch (error.code) {
        case 401:
          setError('Invalid credentials.')
          break;
        case 400:
          setError('Email is already used.')
          break;
        case 409:
          setError('Account already exists.')
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
          <h4 className="font-[Ubuntu] text-2xl">Create an Account</h4>
          <p className="text-[#86868e] text-[14px] sm:text-[16px] font-[Inter]">Already have an account? <Link to={'/login'} className="font-[Inter] hover:underline text-white">Login</Link> </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <div onClick={handleAuthGoogle} className="flex items-center justify-center w-[100%] border-[0.4px] border-[#25252a] bg-[#141416] hover:bg-[#3b3b40] items-center justify-center gap-2 cursor-pointer">
            <img className="w-[30px]" src="/images/google-icon.png" />
            <p className="text-white font-[Inter]">Login with Google</p>
          </div>
        </div>

        <div className=" flex flex-col gap-2 text-white font-[Inter] w-full">
          <Input
            type={'text'}
            label={'USERNAME'}
            placeholder="Maha pro"
            className="bg-[#171719] p-1.5 w-full text-[15px]"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            type={'email'}
            label={'EMAIL'}
            placeholder="you@example.com"
            className="bg-[#171719] p-1.5 w-full text-[15px]"
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            type={'password'}
            label={'PASSWORD'}
            placeholder="mypass#123"
            className="bg-[#171719] p-1.5 w-full text-[15px]"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          {
            error && <p className="text-red-500 mb-3 font-[Inter]">{error}</p>
          }

          <Button loadingText={loading && 'Creating...'} type="submit" className="bg-white w-full cursor-pointer text-black font-[Ubuntu] p-1 hover:bg-[#acacb0]">Sign up</Button>
        </div>

      </div>
    </form>
  )
}