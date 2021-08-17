import React, {useState} from 'react';
import axios from 'axios';
import { Button, Input } from 'antd';
import {useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import SingleComment from './SingleComment';

const TextArea = Input;

function Comment(props) {
    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const body = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }

        axios.post('/api/comment/saveComment', body)
            .then(response => {
                if (response.data.success) {
                    setComment("");
                    props.refreshFunction(response.data.result);
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
        <div>
            <br/>
            <p>Comment</p>
            <hr/>
            {console.log(props.CommentLists)}
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction}/>
                    </React.Fragment>
                )
            ))}

            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <TextArea
                    style={{width:'100%', borderRadius: '5px'}}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="후기를 작성해주세요"/>
                <br/>
                <Button style={{width: '20%', height: '52px'}}
                onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default Comment;
