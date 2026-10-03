import { useEffect, useState } from "react"
import { getLoggedinUser } from "../api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [email, setEmail] = useState<string>("Not logged in");
    const navigation = useNavigate()
    
    useEffect(()=> {
      let authenticated = false;

      const load = async () => {
        try {
          const user = await getLoggedinUser();
          setEmail(user.email);
          authenticated = true
        } catch {
          authenticated = false
        } finally {
          setTimeout(() => {
            if (!authenticated) navigation("/") ;
          }, 3000);
        }
      };
  
      load();
    }, [])
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h1 className="text-3xl">{email ? email : "Not logged in"}</h1>
    </div>
  )
}

export default Dashboard
