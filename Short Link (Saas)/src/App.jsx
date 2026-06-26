import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import { AuthService } from "./Appwrite/auth/auth";
import { login, logout } from "./store/authSlice";
import { MainLoading } from "./components/layouts/Loading/MainLoading";
import { useMemo } from "react";
import { DatabaseService } from "./Appwrite/config/databaseService/database";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const database = useMemo(() => new DatabaseService(), [])
  const authentication = useMemo(() => new AuthService(), [])

  useEffect(() => {

    const startTime = Date.now()

    async function fetchUser() {
      try {
        const authInfo = await authentication.getUserData();

        if (!authInfo) return

        const userInfo = await database.getUser({ userId: authInfo.$id })

        if (userInfo) {

          dispatch(
            login({
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
            }),
          );
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error(error)
      } finally {
        const time = Date.now() - startTime
        const remaining = Math.max(10 - time, 0);

        setTimeout(() => {
          setLoading(false)
        }, remaining)
      }
    };
    fetchUser()
  }, []);



  return (
    <div>
      {
        loading ? <MainLoading></MainLoading> : <Outlet></Outlet>
      }
    </div>
  );
}

export default App;
