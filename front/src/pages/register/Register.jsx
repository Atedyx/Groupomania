import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom"; // useNavigate permet de renvoyer quelque sur une page
import { Link } from "react-router-dom";


export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!"); // defini le msg
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("http://localhost:4200/api/auth/register", user);
        history("/login"); // par exemple ici au /login
      } catch (err) {
        console.log(err);
      }
    }
  };

  function errorMessage() {
    var error = document.getElementById("error")
    if (isNaN(document.getElementById("test").value)) 
    {

        // Changing HTML to draw attention
        error.innerHTML = "<span style='color: red;'>"+
                    "L'email saisie est invalide !</span>"
    } else {
        error.innerHTML = ""
    }
  }

  

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
        <img className="logoGp" src={`${PF}icon-left-font-monochrome-black.png`}></img>
        </div>
        <div className="loginRight">
          <form className="loginBox" onClick={errorMessage} onSubmit={handleClick}>
            <input
              placeholder="Pseudo"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
              id="test"
            />
            <span id="error"></span>
            <input
              placeholder="Mot de passe"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Confirmer le mot de passe"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Inscription
            </button>
            <Link to="/login"><button className="loginRegisterButton">Se connecter</button></Link>
          </form>
        </div>
      </div>
    </div>
  );
}
