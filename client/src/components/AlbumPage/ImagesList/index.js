import React, {useEffect, useState} from 'react';
import {getImages} from "../../../api/album";
import ImageItem from './ImageItem';
import {deleteImage} from "../../../api/album";
import './index.css';
import {useHistory} from 'react-router-dom';

function ImagesList({selectedLink, setImages, albumsDirectory, imagesList}) {
    const history = useHistory();
    const [isLoading, handleLoading] = useState(true);

    const fetchImages = () => {
        handleLoading(true)
        if (!selectedLink) {
            history.push('/');
            return
        }
        getImages(selectedLink.recordId, selectedLink.url)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw  new Error(res.error)
                }
                setImages(res);
            })
            .catch(err => {
                alert(err);
            })
            .finally(() => {
                handleLoading(false)
            })
    };

    useEffect(() => {
        fetchImages();
        return () => {
            setImages(null);
        }
    }, [selectedLink]);

    const imageItemList = imagesList && imagesList.images.map(image => (
        <ImageItem key={image.name} image={image} path={imagesList.path} albumsDirectory={albumsDirectory}
        handleDelete={() => {
            deleteImage(image.name, selectedLink.recordId, selectedLink.url, imagesList.path)
                .then(res => {
                    if (res.error) {
                        throw new Error(res.error);
                    }

                    setImages({...imagesList, images: imagesList.images.filter((filteredImage) => filteredImage.name !== image.name)})
                    // fetchImages();
                })
                .catch(err => {alert(err)})
        }}/>
    ));

    return (
        <>
            <div>
                <span className={"nav-btn"} onClick={() => {
                    history.push('/links')
                }}>
                    К ссылкам</span> | <span className={"nav-btn"} onClick={() => {
                history.push('/')
            }}>На главную</span>
            </div>
            {isLoading ? null :
                <>
                    <ul className={'image-list'}>
                        {imageItemList}
                    </ul>
                    {imagesList && imagesList.images.length ? null : <p>Изображения не были найдены или не соответствуют требованиям</p>}
                </>
            }

        </>
    )
}

export default ImagesList