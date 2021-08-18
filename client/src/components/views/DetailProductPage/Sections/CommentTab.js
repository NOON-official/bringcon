import React, {useState} from 'react';
import axios from 'axios';
import { Button, Input, Comment, Avatar } from 'antd';
import {useSelector} from 'react-redux';
import Swal from 'sweetalert2';
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
                    Swal.fire (
                        'Oops...',
                        '후기를 저장하지 못했습니다.',
                        'error'
                    )
                }
            })
    }

    return (
        <div className="commentlist">
            <br/>
            
            {/* comment lists */}

            {props.commentLists && props.commentLists.map((comment, index) => (
                <React.Fragment key={index}>
                    <div>
                        <Comment
                            author={comment.writer.name}
                            avatar = {
                                <Avatar
                                    src={comment.writer && comment.writer.image}
                                    alt="image"/>
                            }
                            content = {
                                <p>
                                    {comment.content}
                                </p>
                            }>
                        </Comment>
                    </div>
                </React.Fragment>
            ))}

            <hr/>

            {/* Comment Form */}

            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <TextArea
                    style={{width:'100%', borderRadius: '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="후기를 작성해주세요"
                />
                <br/>
                <Button style={{width: '20%', height: '52px'}}
                onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default CommentTab;
