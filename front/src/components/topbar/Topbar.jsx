import "./topbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios'
import cookie from "js-cookie" // Une API JavaScript simple et légère pour gérer les cookies

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const removeCookie = (key) => {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  };
  const logout = async () => {
    await axios({
      method: "get",
      url: "http://localhost:4200/api/auth/logout",
      withCredentials: true,
    })
      .then(() => removeCookie("jwt"))
      .catch((err) => console.log(err));
    localStorage.removeItem("user");
    window.location = "/login";
  };


  
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Groupomania</span>
        </Link>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
        <Link to="/" style={{ textDecoration: "none", color: "white"}}>
          <span className="topbarLink">Page d'acceuil</span>
        </Link>
          <span className="topbarLink" onClick={logout}>Déconnexion</span>
        </div>
        <Link to={`/profile/${user?.user.username}`}>
          <img
            src={
              user?.user.profilePicture
                ? PF + user?.user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
