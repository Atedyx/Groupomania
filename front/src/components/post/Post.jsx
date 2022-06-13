import "./post.css";
import { MoreVert } from "@mui/icons-material"; // Icon
import { useContext, useEffect, useState } from "react";
import axios from "axios"; // axios permet de faire des apl api
import { Link } from "react-router-dom"; // Permet d'envoyer un bouton sur un lien comme <a>
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs"; //permet d'afficher par exemple il y a 1h
require("../../../node_modules/dayjs/locale/fr");
const relativeTime = require("../../../node_modules/dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);



export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; // Lien pour img
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const config = {
        headers: { Authorization: 'Bearer ${token}' }
      };
      const res = await axios.get(`http://localhost:4200/api/users?userId=${post.userId}`, config);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);


  



  const likeHandler = () => {
    try {
      axios.put("http://localhost:4200/api/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deletePost = () => {
    axios.delete('http://localhost:4200/api/posts/'+ post._id, {
      userId: post.userId,
    })
    .then(response => response.status)
    .catch(err => console.warn(err));
  }
  const [userDesc, setUserDesc] = useState()
  const modifPost = () => {
    axios.put('http://localhost:4200/api/posts/'+ post._id,  {
      userId: post.userId,
      desc: userDesc
    })
    .then(response => response.status)
    .catch(err => console.warn(err));
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
          </div>
          <div className="postTopRight">
            <input className="testt" onChange={(e) => { setUserDesc(e.target.value) }} type="text" placeholder="Modifier votre post ici" />
            <button onClick={modifPost}>Modifier</button>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          { post.img && <img className="postImg" src={PF + post.img} alt="" /> }
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} personnes ont liké</span>
            
          </div>
          <button onClick={deletePost}>Supprimer le post</button>
            
        </div>
      </div>
    </div>
  );
}
