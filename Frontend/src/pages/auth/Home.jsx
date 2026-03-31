import { useContext } from "react";
import { AuthContext } from "../../context/authContext.jsx"
import { logoutUser } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      setUser(null);
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Home</h1>

      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <h2>Not logged in</h2>
      )}
    </div>
  );
}

export default Home