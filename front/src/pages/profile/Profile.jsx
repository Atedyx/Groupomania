import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username; // je recuperer avec useParams le username

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:4200/api/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  const [userUsername, setUserUsername] = useState()
  const modifPost = () => {
    axios.put('http://localhost:4200/api/users/' + user._id, {
      userId: user._id,
      username: userUsername,
      isAdmin: user.isAdmin
    })
      .then(response => response.status)
      .catch(err => console.warn(err));
    window.location.reload()
  }
  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user?.username}</h4>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
          </div>
        </div>
      </div>
    </>
  );
}
