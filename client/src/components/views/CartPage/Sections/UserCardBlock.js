import React, {useState} from 'react';
import "./UserCardBlock.css";
import {Checkbox} from 'antd';
function UserCardBlock(props) {

    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    // const renderCartImage = (images) => {
    //     if (images.length > 0) {
    //         let image = images[0]
    //         return `http://localhost:5000/${image}`
    //     }
    // }
    function handleChange(checkedValues) {
        console.log('checked = ', checkedValues.target.value);
    }

    const onCheckAllChange = e => {
        // setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };




    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index} className="rendered-card">
                <td>
                    <Checkbox value={product} onChange={handleChange}/>
                </td>
                <td>
                    <img style={{ width: '142px', height: '80px' }} alt="product" className="cart-image"
                    src={product.s3thumbnail} />    
                </td>
                <td style={{width: '200px', marginLeft: '26px'}}>
                    <div className="cart-title">{product.title}</div>
                    <br/>
                    <div className="cart-seller">{product.writer.name}</div>
                </td>
                <td>
                    <span className="cart-price">{product.price}원</span>
                    <br/>
                    <div style={{marginTop: '8px'}}>
                        {product.tags && product.tags.map((tag) => {
                            return (
                            <a href={`/hashtag/${tag}`} className="link-tags">
                                {" "}
                                <li className="content-tags">{tag}</li>
                                {" "}
                            </a>
                            );
                        })}
                    </div>
                </td>
            </tr>
        ))
    )


    return (
        <div>
            <table style={{marginLeft: '63px', width: '1000px'}}>       
                <tbody>
                    <td className="remove-info" colSpan='3'>
                        <div className="check-all-text" style={{width:'100px'}}>
                            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} style={{marginRight: '4px'}}/>
                            전체 선택
                        </div>
                    </td>
                    <td className="remove-info">
                    <button style={{float:'right'}} className="single-remove-button">선택 삭제</button>
                    </td>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
