import React, {useState} from 'react';
import {createAlbum, getAlbumsList, getLinksList} from "../../../api/album";
import './index.css';
import {useHistory} from 'react-router-dom'

function NewAlbumForm({setHostnameList, selectedAlbum, setLinksList, chooseLink, chooseAlbum}) {
    const history = useHistory();
    const [text, handleText] = useState('');
    const [isCreating, handleCreating] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        handleCreating(true);
        createAlbum(text)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw new Error(res.error)
                }
                console.log(res.id, res.url);
                chooseLink({recordId:res.id, url: res.url});
                chooseAlbum(res.id);
                handleText('');
                history.push('/images');
                if (selectedAlbum === res.id) {
                    getLinksList(res.id)
                        .then(res => res.json())
                        .then(res => {
                            setLinksList(res)
                        })
                }
                return getAlbumsList()
            })
            .then(res => res.json())
            .then(res => {
                setHostnameList(res);
                console.log(res)
            })
            .catch(err => {
                alert(err)
            })
            .finally(() => {
                handleCreating(false)
            });
    }


    return (
        <>
            <form onSubmit={handleSubmit} className={'album-form'}>
                <input className={'album-input'} type="text" value={text} onChange={(e) => {
                    handleText(e.target.value);
                }}/>
                <input className={'album-submit-btn'} type="submit" value='Создать альбом' disabled={isCreating}/>
            </form>
            {isCreating ? <p style={{color: 'red', textAlign: 'center'}}>Обработка данных...</p> : null}
        </>
    )
}

export default NewAlbumForm;