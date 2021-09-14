import React, { useState, useEffect } from 'react'
import axios from "axios";
import {Col, Comment, Avatar} from'antd'; 
import VerticalMenu from '../VerticalMenu/VerticalMenu';
import './ReviewPage.css';
import Swal from "sweetalert2";
import Cry from '../../../utils/Cry.svg';
import Success from '../../../utils/Success.svg';
import Error from '../../../utils/Error.svg';

function ReviewPage(props) {
    const [UserId, setUserId] = useState("")
    const [Reviews, setReviews] = useState([]);
    const [toggleState, setToggleState] = useState(1);
    const [Deleted, setDeleted] = useState(false)

    if(props.user.userData && UserId === "") {
        setUserId(props.user.userData._id)
    }

    // UserId 가져온 후 getReviews 작동!
    useEffect(() => {
        if(UserId !== ""){
            let body = {
                userId: UserId
            };
            getReviews(body);
        }
    }, [UserId]);

    useEffect(() => {
        if(Deleted === true) {
            setReviews([])
            getReviews({ userId: UserId })
            setDeleted(false)
        }
    }, [Deleted]);

    const getReviews = (body) => {
        axios.post('/api/comment/myReview', body)
        .then((response) => {
            if (response.data.success) {
                response.data.reviews.map((review) => {
                    axios.get(`/api/product/product_by_id?id=${review.postId}`)
                    .then((response) => {
                        if (response.data.success) {
                            setReviews(Reviews => [...Reviews, { review: review, product: response.data.product[0] }])
                        } else {
                            
                            alert("후기 상품 정보를 가져오는데 실패했습니다.")
                        }
                    })
                })
            } else {
                alert("후기를 가져오는데 실패했습니다.");
            }
        })
    }

    const handleDelete = (id) => {
        const data = {reviewId: id}

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            imageUrl: Cry,
            showCancelButton: 'true',
            confirmButtonColor: '#ffcb39',
            cancelButtonColor: '#333333',
            confirmButtonText: '예'
        }).then((result => {
            if (result.value) {
                axios.post('/api/comment/delete', data)
                .then(response => {
                    if (response.data.success) {
                        setDeleted(true)
                        Swal.fire({
                            title: 'Success!',
                            text: '삭제되었습니다!',
                            imageUrl: Success,
                            imageWidth: 200,
                            imageHeight: 176
                        })
                    } else {
                        Swal.fire({
                            title: 'Oops...!',
                            text: '후기를 삭제할 수 없습니다.',
                            imageUrl: Error,
                            imageWidth: 200,
                            imageHeight: 176
                        })
                    }
                })
            }
        }))
    }

    const handleEdit = (id) => {
        const data = {review_id: id}
        
        props.history.push({
            pathname: "/user/review/update",
            state: data
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
                <div className="review-list">
                    <table style={{width: '900px', margin: 'auto'}}>
                        {props.user.userData && Reviews.map((review, index) => (
                            <tbody className="review-tbody" key={index} style={{width: '900px', margin: 'auto'}}>
                                <tr className="review-row" style={{height: '120px'}}>
                                    <td style={{width: '200px'}}>
                                        {/* 상품 썸네일 */}
                                        <img
                                            style={{ width: "142px", height: "80px", borderRadius: "8px" }}
                                            alt="review"
                                            src={review.product.s3thumbnail}
                                        />
                                    </td>
                                    <td style={{width: '145px'}}>
                                        {/* 상품 제목 */}
                                        <div className="review-title">{review.product.title}</div>
                                        {/* 상품 올린 사람 */}
                                        <div className="review-writer">{review.product.writer.name}</div>
                                    </td>
                                    <td>
                                        {/* 후기 */}
                                        <div className="comment">
                                            <Comment
                                                author={review.review.writer.name}
                                                avatar = {
                                                    <Avatar
                                                        style={{width:"42px", height:"42px"}}
                                                        src={review.review.writer && review.review.writer.image}
                                                        alt="image"/>
                                                }
                                                content = {
                                                    <p id="review-content" className="comment-content">
                                                        {review.review.content}
                                                    </p>
                                                }
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        {/* 삭제 & 수정 버튼 */}
                                        <button className="delete-button" onClick={e => { e.preventDefault(); handleDelete(review.review._id)} }>삭제</button>
                                        <br/>
                                        <button className="edit-button" onClick={e => { e.preventDefault(); handleEdit(review.review._id)} }>수정</button>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </Col>
    </div>
    )
}

export default ReviewPage