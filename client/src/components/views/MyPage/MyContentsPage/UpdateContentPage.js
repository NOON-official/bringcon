import React, { useState, useEffect } from "react";
import { Form, Input, Col } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import "./UpdateContentPage.css";
import "../../../utils/Hashtag.css";
import Swal from "sweetalert2";
import Watermark from "./watermark(trans70)-01.png"
const { TextArea } = Input;

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

function UpdateContentPage(props) {
    const user = useSelector((state) => state.user);
    const [hasAccount, setAccount] = useState(false);

    const [ProductId, setProductId] = useState("")
    const [Content, setContent] = useState({});
    
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState(0);
    const [Genre, setGenre] = useState(1);
    const [S3thumbnailPath, setS3thumbnailPath] = useState("");
    const [Tags, setTags] = useState([]);
    const [Width, setWidth] = useState(0);
    const [Height, setHeight] = useState(0);
    const [Format, setFormat] = useState("");

    if(props.location.state.product_id && ProductId === "") {
        setProductId(props.location.state.product_id)
    }

    // ProductId 가져온 후 getContent 작동!
    useEffect(() => {
        if(ProductId !== ""){
            let body = {
                productId: ProductId
            };
            getContent(body);
        }
    }, [ProductId]);

    useEffect(() => {
        if(Content){
            setTitle(Content.title)
            setDescription(Content.description)
            setPrice(Content.price)
            setGenre(Content.genres)
            setS3thumbnailPath(Content.s3thumbnail)
            setTags(Content.tags)
            setWidth(Content.width)
            setHeight(Content.height)
            setFormat(Content.format)
        }
    }, [Content]);

    const getContent = (body) => {
        Axios.post('/api/product/content_by_id', body)
        .then((response) => {
            if (response.data.success) {
                setContent(response.data.content[0])
            } else {
                alert("콘텐츠 정보를 가져오는데 실패했습니다.")
            }
        })
    }

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

    const genreChangeHandler = (event) => {
        setGenre(event.currentTarget.value);
    };

    const resetHandler = (event) => {
        event.preventDefault();
        window.location.replace("/user/mycontents/update");
    };

    const submitHandler = (event) => {
        event.preventDefault();

        if (!Title || !Description || !Genre) {
            return alert(" 모든 값을 넣어주셔야 합니다.");
        }

        const body = {
            productId: ProductId,
            title: Title,
            description: Description,
            genres: Genre,
            tags: Tags
        };

        // 수정할 product id와 정보들을 백엔드로 보내줌
        Axios.post("/api/product/update", body)
        .then(response => {
            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: '콘텐츠 정보가 수정되었습니다.',
                    imageUrl: './success.svg',
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: 'Custom Image',
                    background: '#fff url(../Footer/background.svg)',
                    })
                props.history.push("/user/mycontents");
            } else {
                alert("콘텐츠 정보를 수정할 수 없습니다.")
            }
        })
    };

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
        style={{ width: "auto", minHeight: "90vh", margin: "auto" }}
        id="body"
        >
            <div
                style={{ width: "90%", margin: "auto", paddingTop: "50px" }}
                className="upload-box"
            >
                <Form onSubmit={submitHandler}>
                    <Col lg={12} sm={24} className="upload-zone">
                        <div style={{ justifyContent: "space-between" }}>
                        {S3thumbnailPath && (
                            <div>
                            <img style={{
                                    width: 629,
                                    height: 354,
                                    border: "3px solid #ffcb39",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "12px",
                                    filter: "brightness(35%)",
                                }}
                                src={S3thumbnailPath}
                                alt="thumbnail"
                            />
                            <div style={{position: "absolute"}}>
                                <img style={{
                                    position: "relative",
                                    width: "550px",
                                    bottom: "224px",
                                    left: "40px",
                                    filter: "brightness(45%)"
                                }}
                                src={Watermark}/>
                            </div>
                            </div>
                        )}
                        </div>
                        <br />
                        <Input
                            onChange={titleChangeHandler}
                            value={Title}
                            placeholder="제목을 입력하세요."
                            className="upload-title"
                            style={{ backgroundColor: "#1C1C1C", color: "#fff" }}
                        />
                        <br />
                        <div className="upload-price">{`${Price}원`}</div>
                        <br />
                        <br />
                        <button onClick={resetHandler} className="upload-reset">
                            초기화
                        </button>
                        <button type="submit" className="upload-submit">
                            수정 완료
                        </button>
                    </Col>
                    <Col lg={12} sm={24} className="upload-info">
                        <div className="box">
                        <div className="tags-input">
                            <input
                                className="upload-tags"
                                type="text"
                                placeholder="스페이스바를 눌러 해시태그를 입력하세요"
                                onKeyUp={(e) => (e.keyCode === 32 ? addTags(e) : null)}
                            />
                        </div>
                        <div>
                            <ul>
                            {Tags && Tags.map((tag, index) => (
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
                        <button className="video-setting" disabled> 확장자 {Format}</button>
                        <button className="video-setting" disabled> {Width} x {Height}</button>
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
                        </div>
                    </Col>
                    <div className="update-alert">* 이미 업로드된 영상과 가격은 변경이 불가능합니다.</div>
                </Form>
            </div>
        </div>
    );
}

export default UpdateContentPage;