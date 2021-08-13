import React, {useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import { Comment, Avatar, Button, Input } from 'antd';
import Swal from 'sweetalert2';

const {TextArea} = Input;

function SingleComment(props) {
    const user = useSelector(state =>state.user);
    const [CommentValue, setCommentValue] = useState("");

    const handleChange = (e) => {
        setCommentValue(e.current.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const body = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }

        axios.post('/api/comment/saveComment', body)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("");
                    props.refreshFunction(response.data.result);
                } else {
                    Swal.fire(
                        'Oops...',
                        '후기를 저장하지 못했어요',
                        'error'
                    )
                }
            })
    }

    return (
        <div>
            <Comment
                author={props.comment.writer.name}
                avatar = {
                    <Avatar
                        src={props.comment.writer.image}
                        alt="image"/>
                }
                content = {
                    <p>
                        {props.comment.content}
                    </p>
                }></Comment>
        </div>
    )
}

export default SingleComment;