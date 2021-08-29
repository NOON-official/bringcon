import React, { useState, useEffect } from 'react'
import axios from "axios";
import {Col, Checkbox} from'antd'; 
import VerticalMenu from '../VerticalMenu/VerticalMenu';
import './MyContentsPage.css';
import Swal from "sweetalert2";

function MyContentsPage(props) {
    const [UserId, setUserId] = useState("")
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [toggleState, setToggleState] = useState(1);
    const [Fee, setFee] = useState(15)

    if(props.user.userData && UserId === "") {
        setUserId(props.user.userData._id)
    }

    // UserId 가져온 후 getProducts 작동!
    useEffect(() => {
        if(UserId !== ""){
            let body = {
            skip: Skip,
            };
            getProducts(body);
        }
    }, [UserId]);

    const getProducts = (body) => {
        axios.post(`/api/product/products_by_userId?userId=${UserId}`, body)
        .then((response) => {
            if (response.data.success) {
                setProducts(response.data.productInfo);
            } else {
                alert("상품들을 가져오는데 실패 했습니다.");
            }
        });
    };

    const handleDelete = (id) => {
        const data = {product_id: id}
        // console.log(data)

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 영상은 판매가 중지됩니다.',
            icon: 'warning',
            showCancelButton: 'true',
            confirmButtonColor: '#ffcb39',
            cancelButtonColor: '#333333',
            confirmButtonText: '예'
        }).then((result => {
            if (result.value) {
                console.log(data)
                // axios.post('/api/product/delete', data)
                // .then(response => {
                //     if (response.data.success) {
                //         Swal.fire({
                //             title: 'Success',
                //             text: '삭제되었습니다!',
                //             icon: 'success'
                //          })
                //     } else {
                //         alert("상품을 삭제할 수 없습니다.")
                //     }
                // })
            }
        }))
    }

    const handleEdit = (id) => {
        const data = {product_id: id}
        console.log(data)
       
        //수정 할 product id를 백엔드로 보내줌
        // axios.post('/api/product/update', data)
        // .then(response => {
        //     if (response.data.success) {
        //         alert("상품 정보가 수정되었습니다.")
        //     } else {
        //         alert("상품 정보를 수정할 수 없습니다.")
        //     }
        // })
    }
    
    // 수수료 공제
    const deductFee = (price) => {
        let result = Math.ceil(price - ( price * (Fee / 100) )); // 반올림
        return result
    }

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const handleToggle = (e) => {
        let element = e.currentTarget.children[0].children[0]
        let _element =  element.children[1]

        if(_element.classList.contains('block')){
            _element.classList.remove('block')
            element.children[0].innerHTML = '▶&nbsp;&nbsp;&nbsp;&nbsp;판매 내역'
        } else {
            _element.classList.add('block')
            element.children[0].innerHTML = '▼&nbsp;&nbsp;&nbsp;&nbsp;판매 내역'
        }
    }

    return (
    <div id="body" style={{paddingTop: '50px', maxWidth: '100vw', margin: 'auto'}}>
        <Col style={{float: 'left', marginLeft: '84px', marginRight: 0}}>
            <VerticalMenu/>
        </Col>
        <Col style={{float: 'right', width: '1150px'}}>
            <div className="mycontents-container">
                <div className="mypage-bloc-tabs">
                    <button className={toggleState === 1 ? "mypage-tabs active-tabs" : "mypage-tabs"}
                    onClick={() => toggleTab(1)}>
                        업로드 내역
                    </button>
                    {/* <SearchFeature/> */}
                </div>
                <div className="product-list">
                    <table style={{width: '900px', margin: 'auto'}}>
                        {props.user.userData && Products.map((product, index) => (
                        <tbody key={index} style={{width: '900px', margin: 'auto'}}>
                            <tr className="product-row" style={{height: '120px'}}>
                            <td>
                                {/* 썸네일 */}
                                <img
                                    style={{ width: "142px", height: "80px", borderRadius: "8px" }}
                                    alt="product"
                                    src={product.s3thumbnail}
                                />
                            </td>
                            <td>
                                {/* 상품 제목 */}
                                <div className="product-title">{product.title}</div>
                                {/* 상품 가격 */}
                                <div className="product-price">{`${product.price.toLocaleString("ko-KR")}원`}</div>
                            </td>
                            <td>
                                {/* 총 판매 금액 */}
                                <div className="product-total-price">{`총 판매 금액 : ${product.sold ? (product.sold * product.price).toLocaleString("ko-KR") : 0}원`}</div>
                            </td>
                            <td>
                                <button className="delete-button" onClick={e => { e.preventDefault(); handleDelete(product._id)} }>삭제</button>
                                <br/>
                                <button className="edit-button" onClick={e => { e.preventDefault(); handleEdit(product._id)} }>수정</button>
                            </td>
                            </tr>
                            <tr className="toggle-box" onClick={e => { e.preventDefault(); handleToggle(e)}}>
                                <td colSpan="4">
                                    <div className="product-info">
                                        <span>▶&nbsp;&nbsp;&nbsp;&nbsp;판매 내역</span>
                                        <div className='close'>
                                            <div>
                                                <span style={{paddingRight: '111px'}}>판매 횟수</span>
                                                <span>{`${product.sold}회`}</span>
                                            </div>
                                            <div>
                                                <span style={{paddingRight: '111px'}}>정산 금액</span>
                                                <span>{`${product.sold ? deductFee(product.sold * product.price).toLocaleString("ko-KR") : 0}원 (수수료 ${Fee}%)`}</span>
                                            </div>
                                        </div>
                                    </div>
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

export default MyContentsPage