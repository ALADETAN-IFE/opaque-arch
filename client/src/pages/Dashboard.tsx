import { useState } from "react"

const Dashboard = () => {
    const [email, setEmail] = useState<string>("Not logged in");
  return (
    <div>
      {email}
    </div>
  )
}

export default Dashboard
