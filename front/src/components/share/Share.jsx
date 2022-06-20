import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@mui/icons-material";
import { useContext, useRef, useState } from "react"; // useRef renvoie un objet ref modifiable
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user?.user._id,
      desc: desc.current.value,
    };
    if (file) {
      const token = JSON.parse(localStorage.getItem('user')).user.token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("http://localhost:4200/api/upload", data, config,  );
      } catch (err) {}
      console.log(data)
    }
    try {
      const token = JSON.parse(localStorage.getItem('user')).user.token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post("http://localhost:4200/api/posts", newPost, config);
      
    } catch (err) {}
    window.location.reload()
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user?.user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"À quoi penses-tu " + user?.user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button className="shareButton" type="submit">
            Publier
          </button>
        </form>
      </div>
    </div>
  );
}
