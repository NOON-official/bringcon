import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Form, Input, Icon, Col } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import Progress from "../../utils/Progress/Progress";
import "./Upload.css";
import "../../utils/Hashtag.css";
const { TextArea } = Input;

const Genres = [
  { key: 1, value: "Emotions" },
  { key: 2, value: "Foods and Drinks" },
  { key: 3, value: "Animals" },
  { key: 4, value: "Gaming" },
  { key: 5, value: "Animations" },
  { key: 6, value: "Sports" },
];

const Categories = [
  { key: 1, value: "Clips" },
  { key: 2, value: "Memes" },
];

function UploadProductPage(props) {
  const user = useSelector((state) => state.user);
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Genre, setGenre] = useState(1);
  const [Category, setCategory] = useState(1);
  const [Images, setImages] = useState([]);
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [S3thumbnailPath, setS3thumbnailPath] = useState("");
  const [Tags, setTags] = useState([]);
  const [progress, setProgress] = useState(0);
  const [hasAccount, setAccount] = useState(false);

  const removeTags = (indexToRemove) => {
    setTags(Tags.filter((_, index) => index !== indexToRemove));
  };
  const addTags = (event) => {
    if (event.keyCode === 32 && event.target.value !== "") {
      setTags([...Tags, event.target.value.trim()]); //공백 제거
      event.target.value = "";
    }
  };

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value);
  };

  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value);
  };

  const genreChangeHandler = (event) => {
    setGenre(event.currentTarget.value);
  };

  const CategoryChangeHandler = (event) => {
    setCategory(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const resetHandler = (event) => {
    event.preventDefault();
    window.location.replace("/product/upload");
  };

  const dropHandler = (files) => {
    setProgress(0);
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
      //프로그레스 바 상태 config에 추가
      onUploadProgress: (progressEvent) => {
        setProgress(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    };

    formData.append("file", files[0]);

    Axios.post("/api/product/video", formData, config).then((response) => {
      console.log(user);
      if (response.data.success) {
        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.s3VideoPath);

        Axios.post("/api/product/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.filePath);
            setS3thumbnailPath(response.data.s3FilePath);
            setImages((Images) => [...Images, response.data.filePath]);
          } else {
            setProgress(0);
            alert("썸네일 생성에 실패했습니다.");
          }
        });
      } else {
        if (response.data.err === "not allowed format") {
          alert("파일 확장자를 확인해주세요.");
        } else {
          alert("파일을 저장하는데 실패했습니다.");
        }
        setProgress(0);
      }
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (
      !Title ||
      !Description ||
      !Price ||
      !Genre ||
      !Category ||
      Images.length === 0
    ) {
      return alert(" 모든 값을 넣어주셔야 합니다.");
    }

    //서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인 된 사람의 ID
      writer: user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      genres: Genre,
      categories: Category,
      filePath: FilePath,
      duration: Duration,
      thumbnail: ThumbnailPath,
      s3thumbnail: S3thumbnailPath,
      tags: Tags,
    };

    Axios.post("/api/product", body).then((response) => {
      if (response.data.success) {
        alert("상품 업로드에 성공 했습니다.");
        props.history.push("/");
      } else {
        alert("상품 업로드에 실패 했습니다.");
      }
    });
  };

  // const deleteHandler = (image) => {
  //   const currentIndex = Images.indexOf(image);
  //   let newImages = [...Images];
  //   newImages.splice(currentIndex, 1);
  //   setImages(newImages);
  // };

  if (hasAccount === false) {
    if (user.userData && user.userData.bank !== undefined) {
      setAccount(true);
    }

    return (
      <div
        style={{ width: "100vw", height: "90vh", margin: "auto" }}
        className="upload-body"
      >
        {" "}
        <div
          style={{ width: "90%", margin: "auto", paddingTop: "50px" }}
          className="upload-box"
        >
          <a href="/user/account">
            판매자 정보를 입력해야 동영상을 업로드 할 수 있습니다.
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ width: "100vw", height: "90vh", margin: "auto" }}
      className="upload-body"
    >
      <div
        style={{ width: "90%", margin: "auto", paddingTop: "50px" }}
        className="upload-box"
      >
        <Form onSubmit={submitHandler}>
          <Col lg={12} sm={24} className="upload-zone">
            <div style={{ justifyContent: "space-between" }}>
              {!progress ? (
                <Dropzone
                  onDrop={dropHandler}
                  multiple={false}
                  // maxSize={100000000}
                  refreshFunction={updateImages}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      style={{
                        width: 629,
                        height: 354,
                        border: "3px solid #ffcb39",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                      }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <Icon
                        type="plus"
                        style={{ fontSize: "3rem" }}
                        className="plus-icon"
                      />
                    </div>
                  )}
                </Dropzone>
              ) : ThumbnailPath ? (
                <div>
                  <img
                    src={`http://localhost:5000/${ThumbnailPath}`}
                    alt="thumbnail"
                  />
                </div>
              ) : (
                <Progress percentage={progress} />
              )}

              {/* <div
            style={{
              display: "flex",
              width: "350px",
              height: "240px",
              overflowX: "scroll",
            }}
          >
            {Images.map((image, index) => (
              <div onClick={() => deleteHandler(image)} key={index}>
                <img
                  style={{ minWidth: "300px", width: "300px", height: "240px" }}
                  src={`http://localhost:5000/${image}`}
                />
              </div>
            ))}
          </div> */}

              {/* 배포용 ( 삭제 X ) */}
              {/* {S3thumbnailPath && ( //ThumbnailPath가 있을 때만 렌더링
            <div>
              <img
                src={`${S3thumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )} */}
            </div>
            <br />
            <br />
            <Input
              onChange={titleChangeHandler}
              value={Title}
              placeholder="제목을 입력하세요."
              className="upload-title"
              style={{ backgroundColor: "#1C1C1C", color: "#fff" }}
            />
            <Input
              type="number"
              onChange={priceChangeHandler}
              placeholder="가격을 입력하세요."
              className="upload-price"
              style={{ backgroundColor: "#1C1C1C", color: "#fff" }}
            />
            <br />
            <br />
            <button type="submit" className="upload-submit">
              업로드하기
            </button>
            <button onClick={resetHandler} className="upload-reset">
              초기화
            </button>
          </Col>
          <Col lg={12} sm={24} className="upload-info">
            <div className="box">
              <div className="tags-input">
                <ul>
                  {Tags.map((tag, index) => (
                    <li key={index} className="tag">
                      <span>{tag}</span>
                      <span
                        className="tag-close-icon"
                        onClick={() => removeTags(index)}
                      >
                        X
                      </span>
                    </li>
                  ))}
                </ul>
                <input
                  className="upload-tags"
                  type="text"
                  placeholder="스페이스바를 눌러 해시태그를 입력하세요"
                  onKeyUp={(e) => (e.keyCode === 32 ? addTags(e) : null)}
                />
              </div>
            </div>
            <hr
              className="upload-line"
              style={{
                height: "3px",
                backgroundColor: "#ffcb39",
                border: "none",
              }}
            />
            <select
              onChange={genreChangeHandler}
              value={Genre}
              className="genres-dropdown"
            >
              {Genres.map((item) => (
                <option key={item.key} value={item.key}>
                  {" "}
                  {item.value}
                </option>
              ))}
            </select>
            <select
              onChange={CategoryChangeHandler}
              value={Category}
              className="catogories-dropdown"
            >
              {Categories.map((item) => (
                <option key={item.key} value={item.key}>
                  {" "}
                  {item.value}
                </option>
              ))}
            </select>
            <TextArea
              onChange={descriptionChangeHandler}
              value={Description}
              style={{
                width: "491px",
                height: "287px",
                marginLeft: "42px",
                background: "transparent",
                color: "#fff",
              }}
              className="upload-description"
              placeholder="영상에 대한 상세 설명을 작성하세요."
            />
          </Col>
        </Form>
      </div>
    </div>
  );
}

export default UploadProductPage;
