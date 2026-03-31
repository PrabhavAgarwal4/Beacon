import { useContext, useState } from "react";
import { getUser, loginUser } from "../../services/authService.js";
import { AuthContext } from "../../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {setUser} = useContext(AuthContext)

  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const data  = await loginUser({email,password})
      
      const res = await getUser()
      console.log(res.data)
      setUser(res.data.data)
      navigate("/");
    }catch(err){
      console.log(err)
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;