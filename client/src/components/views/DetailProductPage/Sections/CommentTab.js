import React, {useState} from 'react';
import axios from 'axios';
import { Button, Input, Comment, Avatar } from 'antd';
import {useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import Error from '../../../utils/Error.svg';
import '../css/CommentTab.css';

const TextArea = Input;

function CommentTab(props) {
    const productId = props.postId

    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id, //using Redux
            postId: productId
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)
                    setcommentValue("")
                    props.refreshFunction(response.data.result)
                } else {
                    Swal.fire ({
                        title: 'Oops...',
                        text: '후기를 저장하지 못했습니다.',
                        imageUrl: Error,
                        imageWidth: 200,
                        imageHeight: 176
                    });
                }
            })
    }

    return (
        <div>
            <div className="comment-form">
        <form style={{display: 'flex', paddingLeft: '8px'}} onSubmit={onSubmit}>
        <Avatar
            className="comment-writer-image"
            style={{width:"42px", height:"42px", marginRight:"15px"}}
            src={user.userData && user.userData.image}
            alt="image"/>
    <TextArea
        className="review-input"
        style={{width:'336px'}}
        onChange={handleClick}
        value={commentValue}
        placeholder="후기를 작성해주세요"
    />
    <br/>
    <Button className="review-upload-button" style={{width: '84px', height: '42px'}}
    onClick={onSubmit}>Submit</Button>
</form>
</div>
        <div>
            <div className="total-comments" style={{color: "#ffcb39", float:'right', fontSize: '16px'}}>총 {props.commentLists.length}개의 후기가 있습니다.</div>
            <div className="commentlist">
            <br/>
            
            {/* comment lists */}

            {props.commentLists && props.commentLists.map((comment, index) => (
                <React.Fragment key={index}>
                    <div className="comment">
                        <Comment
                            author={comment.writer.name}
                            avatar = {
                                <Avatar
                                    style={{width:"42px", height:"42px"}}
                                    src={comment.writer && comment.writer.image}
                                    alt="image"/>
                            }
                            content = {
                                <p className="comment-content">
                                    {comment.content}
                                </p>
                            }>
                        </Comment>
                    </div>
                </React.Fragment>
            ))}
    </div>
    </div>
        
</div>
    )
}

export default CommentTab;
