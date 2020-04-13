import React from 'react';

function Index({text, handleDelete, handleClick}) {

    return (
        <li><span className={'delete-item-btn'} onClick={()=>{handleDelete()}}>&times;</span>
            <p className={'item-text'} onClick={() => {handleClick()}}>{text}</p></li>
    )
}

export default Index