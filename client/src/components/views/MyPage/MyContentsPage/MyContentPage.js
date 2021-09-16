import React, { useState, useEffect } from 'react'
import axios from "axios";
import {Col, Checkbox} from'antd'; 
import VerticalMenu from '../VerticalMenu/VerticalMenu';
import './MyContentsPage.css';
import Swal from "sweetalert2";
import Error from '../../../utils/Error.svg';
import Cry from '../../../utils/Cry.svg';
import Success from '../../../utils/Success.svg';
import mobile from '../../Main/mobile.png';

function MyContentsPage(props) {
    const [UserId, setUserId] = useState("")
    const [Revenue, setRevenue] = useState({})
    const [toggleState, setToggleState] = useState(1);
    const [Fee, setFee] = useState(15)
    const [Deleted, setDeleted] = useState(false)

    if(props.user.userData && UserId === "") {
        setUserId(props.user.userData._id)
    }

    // UserId 가져온 후 getProducts 작동!
    useEffect(() => {
        if(UserId !== ""){
            getRevenue()
        }

        if(Deleted === true) {
            setDeleted(false)
        }
    }, [UserId, Deleted]);

    console.log(props.user.userData && Revenue['product'])

    const getRevenue = () => {
        axios.get(`/api/users/revenue_by_userId?userId=${UserId}`)
        .then((response) => {
            if (response.data.success) {
                setRevenue(response.data.revenue);
            } else {
                Swal.fire({
                    title: 'Oops...!',
                    text: '정산 금액을 조회하는데 실패했습니다.',
                    imageUrl: Error,
                    imageWidth: 200,
                    imageHeight: 176,
                    imageAlt: 'Custom Image',
                    background: '#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210901%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210901T051556Z&X-Amz-Expires=86400&X-Amz-Signature=e0cd25d9c0ca96f3cfa764e2a894db9f8f1b216d68f762ea97bedc9149d5abf6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)',
                  })
            }
        });
    };

    const handleDelete = (id) => {
        const data = {product_id: id}

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 영상은 판매가 중지됩니다.',
            imageUrl: Cry,
            showCancelButton: 'true',
            confirmButtonColor: '#ffcb39',
            cancelButtonColor: '#333333',
            confirmButtonText: '예'
        }).then((result => {
            if (result.value) {
                axios.post('/api/product/delete', data)
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
                            text: '상품을 삭제할 수 없습니다.',
                            imageUrl: Error,
                            imageWidth: 200,
                            imageHeight: 176,
                            imageAlt: 'Custom Image',
                            background: '#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210901%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210901T051556Z&X-Amz-Expires=86400&X-Amz-Signature=e0cd25d9c0ca96f3cfa764e2a894db9f8f1b216d68f762ea97bedc9149d5abf6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)',
                          })
                     }
                 });
            }
        }))
    }

    const handleEdit = (id) => {
        const data = {product_id: id}
            
        props.history.push({
            pathname: "/user/mycontents/update",
            state: data
        })
    }
    
    // 수수료 공제
    const getDeductedFee = (price) => {
        let result = Math.ceil(price - ( price * (Fee / 100) )); // 반올림
        result = result.toLocaleString("ko-KR")
        return result
    }

    const getMonthOfPurchase = (date) => {
        let result =  date.replace('_', '.')
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

    const isEmptyObject = (param) => {
        return Object.keys(param).length === 0 && param.constructor === Object;
      }
    console.log(isEmptyObject(Revenue))

    return (
    <div>
        <div id="small-body">
            <img src={mobile} className="mobile"/>
        </div>
        <div id="body" style={{paddingTop: '50px', maxWidth: '100vw', margin: 'auto'}}>
            <Col style={{float: 'left', marginLeft: '84px', marginRight: 0}}>
                <VerticalMenu/>
            </Col>
            <Col style={{float: 'right', width: '1150px'}}>
                <div className="mycontents-container">
                    <div className="mypage-bloc-tabs">
                        <button className={toggleState === 1 ? "mypage-tabs active-tabs" : "mypage-tabs"}
                        onClick={() => toggleTab(1)}>
                            월별 정산
                        </button>

                        <button className={toggleState === 2 ? "mypage-tabs active-tabs" : "mypage-tabs"}
                        onClick={() => toggleTab(2)}>
                            업로드 내역
                        </button>
                    {/* <SearchFeature/> */}
                    </div>
                    <div className={toggleState === 1 ? "content  active-content" : "content"} id="product-list">
                        {/* 월별 정산 */}
                    </div>
                    <div className={toggleState === 2 ? "content  active-content" : "content"} id="product-list">
                        <table style={{width: '900px', margin: 'auto'}}>
                            {props.user.userData && !isEmptyObject(Revenue) && Revenue['product'].map((product, index) => (
                            <tbody key={index} style={{width: '900px', margin: 'auto'}}>
                                <tr className="product-row" style={{height: '120px'}}>
                                <td>
                                    {/* 썸네일 */}
                                    <img
                                        style={{ width: "142px", height: "80px", borderRadius: "8px" }}
                                        alt="product"
                                        src={product.id.s3thumbnail}
                                    />
                                </td>
                                <td>
                                    {/* 상품 제목 */}
                                    <div className="product-title">{product.id.title}</div>
                                    {/* 상품 가격 */}
                                    <div className="product-price">{`${product.id.price.toLocaleString("ko-KR")}원`}</div>
                                </td>
                                <td>
                                    {/* 총 판매 금액 */}
                                    <div className="product-total-price">{`총 판매 금액 : ${product.id.sold ? (product.id.sold * product.id.price).toLocaleString("ko-KR") : 0}원`}</div>
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
                                                    {product.revenue === undefined 
                                                    ?
                                                        <div>{`판매 내역이 없습니다.`}</div>
                                                    : 
                                                        Object.entries(product.revenue)
                                                        .sort((a, b) => a[0].localeCompare(b[0])) //오름차순 정렬
                                                        .map(([month, value]) => (
                                                            <tr className="revenue-info">
                                                                {/* 판매 연월 */}
                                                                <td style={{width: '150px'}}>
                                                                    <div>{getMonthOfPurchase(month)}</div>
                                                                </td>
                                                                <td style={{width: '215px'}}>
                                                                    <div>
                                                                        <div>{`판매 횟수`}</div>
                                                                        <div>{`정산 금액`}</div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        {/* 판매 횟수 */}
                                                                        <div>{`${value}회`}</div>
                                                                        {/* 정산 금액 */}
                                                                        <div>{`${getDeductedFee(value * product.price)}원 (수수료 ${Fee}%)`}</div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
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
    </div>
    )
}

export default MyContentsPage