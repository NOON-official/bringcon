import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Col, Input } from'antd'; 
import VerticalMenu from '../VerticalMenu/VerticalMenu';
import './ReviewPage.css';
import Swal from "sweetalert2";
const { TextArea } = Input;

function UpdateReviewPage(props) {
    const [ReviewId, setReviewId] = useState("")
    const [Review, setReview] = useState({});
    const [Writer, setWriter] = useState({});
    const [toggleState, setToggleState] = useState(1);
    const [Content, setContent] = useState("");

    if(props.location.state.review_id && ReviewId === "") {
        setReviewId(props.location.state.review_id)
    }

    // ReviewId 가져온 후 getReview 작동!
    useEffect(() => {
        if(ReviewId !== ""){
            let body = {
                reviewId: ReviewId
            };
            getReview(body);
        }
    }, [ReviewId]);

    useEffect(() => {
        if(Review){
            setContent(Review.content)
        }
    }, [Review]);

    const getReview = (body) => {
        axios.post('/api/comment/comment_by_id', body)
        .then((response) => {
            if (response.data.success) {
                setReview(response.data.comment[0])
                setWriter(response.data.writer[0])
            } else {
                alert("후기 정보를 가져오는데 실패했습니다.")
            }
        })
    }

    const contentChangeHandler = (event) => {
        setContent(event.currentTarget.value);
    };

    const handleSave = () => {
        let body = {
            reviewId: ReviewId,
            content: Content
        };

        // 수정할 review id와 content를 백엔드로 보내줌
        axios.post('/api/comment/update', body)
        .then(response => {
            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: '후기가 수정되었습니다.',
                    imageUrl: './success.svg',
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: 'Custom Image',
                    background: '#fff url(../Footer/background.svg)',
                  })
                props.history.push("/user/review");
            } else {
                alert("후기를 수정할 수 없습니다.")
            }
        })
    }

    const toggleTab = (index) => {
        setToggleState(index);
    };

    return (
    <div id="body" style={{paddingTop: '50px', maxWidth: '100vw', margin: 'auto'}}>
        <Col style={{float: 'left', marginLeft: '84px', marginRight: 0}}>
            <VerticalMenu/>
        </Col>
        <Col style={{float: 'right', width: '1150px'}}>
            <div className="reviews-container">
                <div className="mypage-bloc-tabs">
                    <button className={toggleState === 1 ? "mypage-tabs active-tabs" : "mypage-tabs"}
                    onClick={() => toggleTab(1)}>
                        내 후기
                    </button>
                    {/* <SearchFeature/> */}
                </div>
                {props.location.state.review_id && Review.postId &&
                <div className="review-list">
                    <table style={{width: '900px', margin: 'auto'}}>
                        <tbody className="update-review-tbody" style={{width: '900px', margin: 'auto'}}>
                            <tr className="review-row" style={{height: '120px'}}>
                                <td style={{width: '200px'}}>
                                    {/* 상품 썸네일 */}
                                    <img
                                        style={{ width: "142px", height: "80px", borderRadius: "8px" }}
                                        alt="review"
                                        src={Review.postId.s3thumbnail}
                                    />
                                </td>
                                <td style={{width: '300px'}}>
                                    {/* 상품 제목 */}
                                    <div className="review-title">{Review.postId.title}</div>
                                    {/* 상품 올린 사람 */}
                                    <div className="review-writer">{Writer.name}</div>
                                </td>
                                <td>
                                    {/* 저장 버튼 */}
                                    <button className="save-button" onClick={e => { e.preventDefault(); handleSave()} }>저장</button>
                                </td>
                            </tr>
                        </tbody>
                        ))
                    </table>
                    <div>
                        <TextArea
                            className="update-review-content"
                            onChange={contentChangeHandler}
                            value={Content}
                        />
                    </div>
                </div>
                }
            </div>
        </Col>
    </div>
    )
}

export default UpdateReviewPage