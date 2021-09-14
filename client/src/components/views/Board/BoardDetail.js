import React, {Component} from 'react';
import { Table, Button } from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux'
import axios from 'axios';
import Swal from 'sweetalert2';
import './css/BoardDetail.css';
import mobile from '../Main/mobile.png';


class BoardDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {board: []};
        this.state = {writer: ""};
        this.state = {isSame: false};
      }
    
    componentDidMount() {
        if (this.props.location.query !== undefined) {
            this.getDetail();
        } else {
            window.location.href="/board";
        }
    }

    deleteBoard = _id => {
        const send_param = {
            _id
        };

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 글은 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: 'true',
            confirmButtonColor: '#ffcb39',
            cancelButtonColor: '#333333',
            confirmButtonText: '예'
        }).then((result => {
            if (result.value) {
                axios.post("/api/board/delete", send_param)
                Swal.fire({
                    title: 'Success',
                    text: '삭제되었습니다!',
                    icon: 'success'
                })
                window.location.href="/board";
            }
        }))

        // if (window.confirm("정말 삭제하시겠습니까?")) {
        //     axios
        //         .post("/api/board/delete", send_param)
        //         //정상!
        //         .then(returnData => {
        //             if(returnData.data.success){
        //                 alert("삭제되었습니다.");
        //                 window.location.href="/";
        //             } else {
        //                 alert("삭제에 실패했습니다.")
        //             }
        //         })
        //         //에러
        //         .catch(err => {
        //             console.log(err);
        //         });
        // }
    };

    getDetail = () => {
        const send_param = {
            _id: this.props.location.query._id //게시물 고유번호
        };
        const marginBottom = {
            marginBottom: 5
        };
        axios
            .post("/api/board/detail", send_param)
            //정상!
            .then(returnData => {
                if (returnData.data.board[0]) { //해당 게시물이 있으면
                    
                    // 게시물 writer에게만 수정/삭제 버튼 보여주기
                    const {storeUser} = this.props; //현재 로그인한 유저 _id
                    this.setState({writer: returnData.data.board[0].writer}) //게시물 쓴 사람 _id
                    
                    // 로그인 된 상태이고 && 로그인한 유저 === 게시물 쓴 사람이면
                    if(storeUser.hasOwnProperty('_id') && storeUser._id === this.state.writer){
                        this.setState({isSame: true});
                    } else {
                        this.setState({isSame: false});
                    }

                    const board = (
                        <div>
                            <div className="notice" style={{width:'80%', margin:'auto', marginBottom: '16px'}}>공지사항</div>
                                <div style={{width:'80%', margin:'auto'}} className="notice-table">
                                <div style={{height: '515px', width: '1092px', overflow: 'auto'}}>
                            <Table style={{width:'1000px', marginLeft:'40px', marginTop: '27px'}}>
                                <thead style={{backgroundColor:"#ffcb39"}}>
                                    <tr>
                                        <th id='board-detail-title' className='board-detail-content' style={{color: "#ffcb39"}}>{returnData.data.board[0].title}</th>
                                        <td id='board-detail-writer' className='board-detail-content'>
                                            <span style={{color: '#fff'}}>{returnData.data.board[0].name}</span>
                                            
                                        </td>
                                        <td id='board-detail-date' className='board-detail-content'>
                                            <span>{returnData.data.board[0].createdAt.substring(0, 10)}</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr style={{paddingTop: '55px'}}>
                                        <td className='board-detail-content-main' colSpan="2" dangerouslySetInnerHTML={{
                                            __html: returnData.data.board[0].content
                                        }}/>
                                    </tr>
                                </tbody>
                            </Table>
                            </div>
                            <div>
                            <br/>
                        <NavLink
                                to={{
                                    pathname: "/board/write",
                                    query: {
                                        title: returnData.data.board[0].title,
                                        content: returnData.data.board[0].content,
                                        _id: this.props.location.query._id
                                    }
                                }}
                        >
                            <Button block style={marginBottom, { display : `${this.state.isSame ? 'inline-block' : 'none'}`}}
                                className="modify-button">
                                글 수정
                            </Button>
                        </NavLink>
                        <Button
                            style={{ display : `${this.state.isSame ? 'inline-block' : 'none'}`}}
                            block
                            onClick={this.deleteBoard.bind(
                                null, this.props.location.query._id
                            )}
                            className="delete-button">
                                글 삭제
                            </Button>
                            </div>
                        </div>
                        </div>
                    );
                    this.setState({board: board});
                }
            })
            //에러
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const divStyle = {
            margin: 50
        };

        return (
        <div>
            <div id="small-body">
                <img src={mobile} className="mobile"/>
            </div>
            <div id="body" style={{backgroundColor:"#1C1C1C", minHeight: '90.6vh'}}>{this.state.board}</div>;
        </div>
        )
        
    }
}

const mapStateToProps = (state) => ({
    storeUser: state.user.userData
  });
  
export default connect(mapStateToProps)(BoardDetail)