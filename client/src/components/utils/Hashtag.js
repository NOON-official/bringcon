import React from 'react';
import ReactDOM from 'react-dom';
import './Hashtag.css';

const TagsInput = props => {
    const [tags, setTags] = React.useState([]);
    const removeTags = indexToRemove => {
        setTags(tags.filter((_, index) => index !== indexToRemove))
    }
    const addTags = event => {
        if(event.key === "Enter" && event.target.value !== ""){
            setTags([...tags, event.target.value]);
            props.selected([...tags, event.target.value]);
            event.target.value = "";
        }
    };
    return (
        <div className="box">
            <div className="tags-input">
                <ul>
                    {tags.map((tag, index) => (
                        <li key={index} class="tag">
                            <span>{tag}</span>
                            <span className="tag-close-icon"
                            onClick={() => removeTags(index)}>X</span>
                        </li>
                    ))}
                </ul>
                <input
                type="text"
                placeholder="enter 키를 눌러 해시태그를 입력하세요"
                onKeyUp={e => (e.key === "Enter" ? addTags(e): null)}/>
            </div>
        </div>
    );
}

function HashTag(){
    const selected = tags => console.log(tags);
    return (
        <div className = "box">
            <TagsInput selected={selected}/>
        </div>
    )
}


export default HashTag;