import React, { useEffect, useState } from "react";
import { Avatar } from "antd";
import Meta from "antd/lib/card/Meta";
import { Descriptions } from "antd";
import CommentTab from "./CommentTab";
import Collection from "./Collection";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Tabs.css";
import "../css/UserVideo.css";

const Genres = [
  { key: 1, value: "Animals" },
  { key: 2, value: "Animations" },
  { key: 3, value: "Arts" },
  { key: 4, value: "Broadcasting" },
  { key: 5, value: "Business" },
  { key: 6, value: "Cartoon" },
  { key: 7, value: "Character" },
  { key: 8, value: "Land-marks" },
  { key: 9, value: "Music" },
  { key: 10, value: "Nature" },
  { key: 11, value: "Sports" },
  { key: 12, value: "Etc.." }
];

function Tabs(props) {
  const productId = props.detail._id;
  const variable = { productId: productId };

  const [toggleState, setToggleState] = useState(1);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    if (productId !== undefined) {
      axios.post("/api/comment/getComments", variable).then((response) => {
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          Swal.fire("Oops...", "후기를 가져오지 못했어요", "error");
        }
      });
    }
  }, [props]);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const refreshFunction = (newComment) => {
    setComments(newComment.concat(Comments));
  };

  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          여행지 정보
        </button>

        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          같은 사람이
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          후기 보기
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          {/* 해시태그 있어야 하는 부분 */}
          <div style={{ marginBottom: "10px" }}>
            <button className="video-setting" disabled>
              {props.detail.genres && Genres[props.detail.genres - 1].value}
            </button>
            <button
              className="video-setting"
              disabled
              style={{ marginLeft: 0 }}
            >
              {" "}
              {props.detail.format}{" "}
            </button>
            <button className="video-setting" disabled>
              {" "}
              {props.detail.width}X{props.detail.height}{" "}
            </button>
          </div>
          <div>
            {props.detail.tags &&
              props.detail.tags.map((tag) => {
                return (
                  <a href={`/hashtag/${tag}`} className="link-tags">
                    {" "}
                    <li className="content-tags">{tag}</li>{" "}
                  </a>
                );
              })}
          </div>
          <hr />
          <div>
            <Meta
              avatar={
                <Avatar
                  className="Avatar"
                  src={props.detail.writer && props.detail.writer.image}
                />
              }
              title={props.detail.writer && props.detail.writer.name}
            />
          </div>
          <p className="content-details">{props.detail.description}</p>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <div>
            <Collection writer={props.detail.writer} />
          </div>
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
          id="comment-content"
        >
          <CommentTab
            refreshFunction={refreshFunction}
            commentLists={Comments}
            postId={productId}
            style={{ paddingTop: 0 }}
          />
        </div>
      </div>
    </div>
  );
}

export default Tabs;
