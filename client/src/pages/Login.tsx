import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<{ message: string, type: "success" | "error" } | null>(null);

  const navigation = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setResponse({ message: "Email and password are required.", type: "error" });
      return;
    }
    
    try {
      setIsLoading(true)
      await login(email, password);
      setResponse({ message: "Login successful!", type: "success" });
      setTimeout(() => {
       navigation("/app")
     }, 2500);
    } catch (error) {
      setResponse({ message: `An error occurred during login. ${error}`, type: "error" });
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-amber-50">
      <form className="flex flex-col gap-4 bg-blue-300 p-8 rounded-lg shadow-md w-md  text-cyan-950">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <p>Opaque authentication is used to register a new user.</p>
        {response && <p className={response.type === "success" ? "text-green-900" : "text-red-900"}>{response.message}</p>}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-md border border-gray-300 bg-white outline-none focus-within:border-black"
          />
          <div className="flex items-center gap-2 w-full bg-white py-1 px-2 rounded-md border border-gray-300 focus-within:border-black">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-none outline-none w-full"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-blue-500 text-white p-1 rounded-md text-sm">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading} onClick={handleSubmit} className={`bg-blue-500 text-white p-2 rounded-md ${isLoading && "animate-pulse"}`}>
          {isLoading ? "Loading..." : "Login"}
        </button>
        <p>
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
