import React, { useState } from 'react'
import { Input } from 'antd';
import '../css/SearchBar.css';
import CheckBox from './CheckBox';

const { Search } = Input;

function SearchFeature(props) {

    const [SearchTerm, setSearchTerm] = useState("")

    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value)
        props.refreshFunction(event.currentTarget.value)
    }

    return (
        <div>
            <Search
                placeholder="브링콘과 함께 콘텐츠 여행을 떠나보세요!"
                onfocus="this.placeholder = ''"
                onblur="this.placeholder = 'enter your text'"
                onChange={searchHandler}
                style={{ width: 720, height: '40px', borderRadius: '200px'}}
                value={SearchTerm}
            />
        </div>
    )
}

export default SearchFeature
