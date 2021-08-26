import React, {useState} from 'react'
import axios from "axios";
import {Col, Checkbox} from'antd'; 
import VerticalMenu from '../VerticalMenu/VerticalMenu';
// import {CaretRightOutlined} from '@ant-design/icons';
// import HistorySearchFeature from './HistorySearchFeature';
import './History.css';

function HistoryPage(props) {
    if(props.user.userData) {
        console.log(props.user.userData.history)
    }
    
    const [toggleState, setToggleState] = useState(1);
    const [open, setOpen] = useState(false);
 
    const handleClick = (item) => {
        const data = {product_id: item}
        //다운로드 할 product id를 백엔드로 보내줌
        axios.post('/api/product/download', data)
        .then(response => {
            if (response.data.success) {
                window.location.href = response.data.url;
                alert("파일이 다운로드되었습니다.")
            } else {
                alert("다운로드에 실패하였습니다.")
            }
        })
    }

    const toggleTab = (index) => {
        setToggleState(index);
      };

    const handleToggle = () => {
        setOpen(!open);
    }

    const getDateOfPurchase = (dateOfPurchase) => {
        let date = new Date(dateOfPurchase)
        
        const year = String(date.getFullYear())
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        date = `${year}.${month}.${day}`

        return date
    }

    return (
    <div id="body" style={{paddingTop: '50px', maxWidth: '100vw', margin: 'auto'}}>
        <Col style={{float: 'left', marginLeft: '84px', marginRight: 0}}>
            <VerticalMenu/>
        </Col>
        <Col style={{float: 'right', width: '1150px'}}>
            <div className="history-container">
                <div className="mypage-bloc-tabs">
                    <button className={toggleState === 1 ? "mypage-tabs active-tabs" : "mypage-tabs"}
                    onClick={() => toggleTab(1)}>
                        구매 내역
                    </button>
                    {/* <HistorySearchFeature/> */}
                </div>
                <div className="purchased-list">
                    {/* userData와 history가 있으면 */}
                            <table style={{width: '900px', margin: 'auto'}}>
                                <thead style={{height: '68px'}}>
                                    <tr>
                                        <th className="history-checkall" colSpan='4'><Checkbox style={{marginRight: '5px', marginLeft: '10px'}}/>전체 선택</th>
                                        <th><button style={{float:'right'}} className="single-download-button">선택 다운로드</button></th>
                                    </tr>
                                </thead>
                                {props.user.userData && props.user.userData.history &&
                                props.user.userData.history.map((item, index) => (
                                <tbody style={{width: '900px', margin: 'auto'}}>
                                    <tr className="purchased-row" key={index} style={{height: '120px'}}>
                                        <td style={{borderBottom: 'none'}}><Checkbox style={{marginLeft: '10px'}}/></td>  
                                        {/* 여기 썸네일 이미지 들어가야 함 */}
                                    {/* <td>{item.merchantUid}</td> */}
                                    <td>
                                    {/* <div className="purchased-title">{item.name}</div> */}
                                    {/* 여기는 올린 사람 이름 들어가야 함 */}
                                    {/* <div className="purchased-uploader">{item.name}</div> */}
                                    </td>
                                    <td>
                                        {/* <div className="purchased-price">{item.price}원</div> */}
                                    </td>
                                    <td>
                                        {/* <button className="single-download-button" onClick={e => { e.preventDefault(); handleClick(item.id)} }>다운로드</button> */}
                                        <br/>
                                        <button className="rebuy-button">재구매</button>
                                    </td>
                                    </tr>
                                    <tr className="toggle-box">
                                        <td colSpan="5">
                                            <div className="purchase-info" onClick={e => { e.preventDefault(); handleToggle()}}>
                                                구매 내역
                                                <div className={`close ${open ? `block` : ''}`}>
                                                {/* {item.name} */}
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

export default HistoryPage

