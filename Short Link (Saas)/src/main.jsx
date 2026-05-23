import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.jsx'
import MainLayout from './RouteLayouts/MainLayout.jsx'
import Login from './pages/Login.jsx'
import { SignUp } from './pages/SignUp.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import { UpdatePassword } from './pages/UpdatePassword.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { NotFound } from './pages/NotFound.jsx'
import { Landing } from './pages/Landing.jsx'
import { AuthRedirect } from './components/AuthRedirect/AuthRedirect.jsx'
import { DashLayout } from './RouteLayouts/DashLayout.jsx'
import { Home } from './pages/Home.jsx'
import SettingsLayout from './RouteLayouts/SettingsLayout.jsx'
import { ProfileSettings } from './pages/Settings/ProfileSettings.jsx'
import { AccountSettings } from './pages/Settings/AccountSettings.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        element: <MainLayout></MainLayout>,
        children: [
          { path: '/', element: <Landing></Landing> },
        ]
      },
      {
        element: <DashLayout></DashLayout>,
        children: [
          { path: '/home', element: <Home></Home> },
          {
            element: <SettingsLayout></SettingsLayout>,
            children: [
              {
                path: '/settings',
                children: [
                    // {index: true,element: <ProfileSettings></ProfileSettings>},
                    {path: 'profile',element: <ProfileSettings/>},
                    {path: 'account',element: <AccountSettings/> },
                    {path: 'notifications',element: 'NOTIFICATIONS'},
                    {path: 'plans',element: 'PLANS'},
                ]
              }
            ]
          },
        ],
      },
      {
        children: [
          { path: '/login', element: <AuthRedirect><Login></Login></AuthRedirect> },
          { path: '/sign-up', element: <AuthRedirect><SignUp></SignUp></AuthRedirect> },
          { path: '/reset-password', element: <ResetPassword></ResetPassword> },
          { path: '/update-password', element: <UpdatePassword></UpdatePassword> },
          { path: '*', element: <NotFound></NotFound> },
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
