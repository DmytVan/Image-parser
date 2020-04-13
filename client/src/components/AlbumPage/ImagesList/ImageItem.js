import React from 'react';

function ImageItem({image, path, albumsDirectory, handleDelete}) {
    return (
        <li>
            <img src={albumsDirectory + path + '/' + image.name} alt={image.name}/>
            <p><a href={image.originalPath}>original path</a></p>
            <p className={'delete-image-btn'} onClick={() => {handleDelete()}}>&times;</p>
        </li>
    )
}

export default ImageItem