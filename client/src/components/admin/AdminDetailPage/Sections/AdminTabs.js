import React, { useState } from 'react';
import '../css/AdminTabs.css';

function AdminTabs(props) {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
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
          {/* <div>
            <Meta
                avatar={
                    <Avatar className="Avatar" src={product.writer.image} />
                }
                title={product.title}
            />
            <span>{product.writer.name}</span>
          </div> */}
          <p>
          {props.detail.description}
          </p>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <h2>Content 2</h2>
          <hr />
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
        </div>
      </div>
    </div>
  );
}

export default AdminTabs;