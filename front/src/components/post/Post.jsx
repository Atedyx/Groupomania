import "./post.css";
import { ContrastOutlined, MoreVert } from "@mui/icons-material"; // Icon
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios"; // axios permet de faire des apl api
import { Link } from "react-router-dom"; // Permet d'envoyer un bouton sur un lien comme <a>
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs"; //permet d'afficher par exemple il y a 1h
require("../../../node_modules/dayjs/locale/fr");
const relativeTime = require("../../../node_modules/dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);



export default function Post({ post }) {
  const [like, setLike] = useState([post.likes.length]);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; // Lien pour img
  const { user: currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([])
  const desc = useRef();
  const [file, setFile] = useState(null);


  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser.user._id));
  }, [currentUser.user._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(localStorage.getItem('user')).user.token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get(`http://localhost:4200/api/users/?userId=${post.userId}`, config);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);


  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(localStorage.getItem('user')).user.token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get('http://localhost:4200/api/posts/', config);
      setPosts(res.data);
    };
    fetchUser();
  }, []);



  const likeHandler = () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).user.token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
    
      axios({
        method: 'put', //you can set what request you want to be
        url: "http://localhost:4200/api/posts/" + post._id + "/like",
        data: { userId: currentUser.user._id },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    } catch (err) { }
    setLike(isLiked ? like - 1 : like + 1);
    console.log(like)
    console.log(currentUser.user._id)
    setIsLiked(!isLiked);
    window.location.reload()
  };

  const deletePost = () => {
    const token = JSON.parse(localStorage.getItem('user')).user.token
    axios({
      method: 'delete', 
      url: "http://localhost:4200/api/posts/" + post._id,
      data: { userId: currentUser.user._id, isAdmin: currentUser.user.isAdmin },
      headers: {
        Authorization: 'Bearer ' + token
      }
    })

    window.location.reload()
  }


  const [userDesc, setUserDesc] = useState()
  const modifPost = () => {
    const token = JSON.parse(localStorage.getItem('user')).user.token
    axios({
      method: 'put', //you can set what request you want to be
      url: "http://localhost:4200/api/posts/" + post._id,
      data: { userId: currentUser.user._id, desc: userDesc, isAdmin: currentUser.user.isAdmin },
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => response.status)
      .catch(err => console.warn(err));
    console.log(currentUser)
     window.location.reload()
  }


  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user?.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user?.username}</span>
            <span className="postDate">{dayjs(post.createdAt).locale("fr").fromNow()}</span>
            <div className="dropdown">
          <button className="dropbtn"><MoreVertIcon/></button>
          <div className="dropdown-content">
            <button onClick={deletePost}>Supprimer le post</button>
          </div>
          </div>
          
        </div>
          <div className="postTopRight">
            <input className="testt" onChange={(e) => { setUserDesc(e.target.value) }} type="text" placeholder="Modifier votre post ici" />
            <button onClick={modifPost}>Modifier</button>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && <img className="postImg" src={PF + post.img} alt="" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter"> {like} personnes ont liké</span>

          </div>
        </div>
        
      </div>
    </div>
  );
}
