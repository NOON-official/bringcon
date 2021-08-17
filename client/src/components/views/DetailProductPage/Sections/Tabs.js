import React, {useEffect, useState} from 'react';
import { useDispatch } from "react-redux";
import { Avatar} from 'antd';
import Meta from 'antd/lib/card/Meta';
import Comment from './Comment';
import Collection from './Collection';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/Tabs.css';
import '../css/UserVideo.css';


function Tabs(props) {
    console.log("Tabs",props)
  const productId = props.detail._id;
  const [toggleState, setToggleState] = useState(1);
  const [CommentLists, setCommentLists] = useState([]);
  const body = {
      productId: productId
  }

  const dispatch = useDispatch();

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const updateComment = (newComment) => {
      setCommentLists(CommentLists.concat(newComment))
  }

  useEffect(() => {
      axios.post('api/comment/getComments', body)
        .then(response => {
            if(response.data.success) {
                console.log('response.data.comments', response.data.comment)
                setCommentLists(response.data.comments)
            } else {
                Swal.fire(
                    'Oops...',
                    '후기를 가져오지 못했어요',
                    'error'
                )
            }
        })
  }, [])

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
                    <Avatar className="Avatar" src={props.detail.writer && props.detail.writer.image}/>
                }
                title={props.detail.writer && props.detail.writer.name}
            />
           
          </div>
          <p className="content-details">
          {props.detail.description}
          </p>
        </div>
        
        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <div>
            <Collection/>
          </div>
          {/* <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            voluptatum qui adipisci.
          </p> */}
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <Comment refreshFunction={updateComment} commentLists={Comment} postId={productId}/>
        </div>
      </div>
    </div>
  );
}

export default Tabs;