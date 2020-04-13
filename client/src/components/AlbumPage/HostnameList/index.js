import React, {useEffect} from 'react';
import {getAlbumsList, deleteAlbumsByHostname} from "../../../api/album";
import AlbumListItem from '../AlbumListItem/index';
import {useHistory} from 'react-router-dom';

function HostnameList(props) {
const {setHostnameList, hostnameList, chooseAlbum} = props;

const fetchAlbums = () => {
    getAlbumsList()
        .then(res => res.json())
        .then(res => {
            if(res)
                setHostnameList(res);
        })
        .catch(err => {
            alert(err.message)
        });
};

    useEffect(() => {
        fetchAlbums();
    }, [setHostnameList]);

    const history = useHistory();

    const hostnameItemList = hostnameList.map((item) => (
        <AlbumListItem key={item._id} text={item.hostname}
               handleDelete={() => {
                   if (!window.confirm('Все изображения будут удалены. Продолжить?')) return;
                   deleteAlbumsByHostname(item._id)
                       .then(res => res.json())
                       .then(res => {
                           fetchAlbums()
                       })
                       .catch(err => {alert(err)})
               }}
               handleClick={() => {
                   chooseAlbum(item._id);
                   history.push('/links')
               }}/>
    ));

    return (
        <>
            <div style={{textAlign: 'center'}}>Альбомы</div>
            <ul className={'album-list'}>
                {hostnameItemList}
            </ul>
        </>
    )
}

export default HostnameList