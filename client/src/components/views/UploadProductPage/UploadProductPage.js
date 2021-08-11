import React, { useState } from "react";
import Progress from "../Progress/Progress";
import Dropzone from "react-dropzone";
import { Form, Input, Icon } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import "../../utils/Hashtag.css";
const { TextArea } = Input;

const Genres = [
  { key: 1, value: "영화 & 애니메이션" },
  { key: 2, value: "예능 프로그램" },
  { key: 3, value: "스포츠" },
  { key: 4, value: "동물" },
  { key: 5, value: "어린이" },
  { key: 6, value: "뉴스" },
  { key: 7, value: "드라마" },
];

function UploadProductPage(props) {
  const user = useSelector((state) => state.user);
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Genre, setGenre] = useState(1);
  const [Images, setImages] = useState([]);
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [S3thumbnailPath, setS3thumbnailPath] = useState("")
  const [Tags, setTags] = useState([]);
  const [progress, setProgress] = useState(0);

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

  const updateImages = (newImages) => {
    setImages(newImages);
  };
  
  const resetHandler = (event) => {
    event.preventDefault();
    setImages([]);
    setFilePath("");
    setDuration("");
    setThumbnailPath("");
    setTitle("");
    setDescription("");
    setPrice(0);
    setGenre(1);
    setTags([]);
    setProgress(0);
    alert("초기화되었습니다.");
  }
  
  const dropHandler = (files) => {
    setProgress(0);
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data"},
      //프로그레스 바 상태 config에 추가
      onUploadProgress: progressEvent => {
        setProgress(
          parseInt (
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      }
    };
    
    formData.append("file", files[0]);

    console.log('a')
    Axios.post("/api/product/video", formData, config).then((response) => {
      console.log('b') 
      if (response.data.success) {
        console.log('c')
        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.s3VideoPath);

        Axios.post("/api/product/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.filePath);
            setS3thumbnailPath(response.data.s3FilePath)
            setImages((Images) => [...Images, response.data.filePath]);
          } else {
            setProgress(0);
            alert("썸네일 생성에 실패했습니다.");
          }
        });
      } else {
        setProgress(0);
        alert("파일을 저장하는데 실패했습니다.");
      }
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!Title || !Description || !Price || !Genre || Images.length === 0) {
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

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2> 동영상 업로드 </h2>
      </div>

      <Form onSubmit={submitHandler}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* DropZone */}
          <Dropzone
            onDrop={dropHandler}
            multiple={false}
            // maxSize={100000000}
            refreshFunction={updateImages}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: 336,
                  height: 189,
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

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

          {ThumbnailPath && ( //ThumbnailPath가 있을 때만 렌더링
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}

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
        <Progress percentage={progress}/>
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={Description} />
        <br />
        <br />
        <label>가격(원)</label>
        <Input type="number" onChange={priceChangeHandler} value={Price} />
        <br />
        <label>장르</label>
        <br />
        <select onChange={genreChangeHandler} value={Genre}>
          {Genres.map((item) => (
            <option key={item.key} value={item.key}>
              {" "}
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <label>태그</label>
        <br />
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
              type="text"
              placeholder="스페이스바를 눌러 해시태그를 입력하세요"
              onKeyUp={(e) => (e.keyCode === 32 ? addTags(e) : null)}
            />
          </div>
        </div>
        <button onClick = {resetHandler}>초기화</button>
        <button type="submit">확인</button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
