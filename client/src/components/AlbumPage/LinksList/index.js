import React, {useEffect, useState} from 'react';
import {getLinksList, deleteLink} from "../../../api/album";
import AlbumListItem from '../AlbumListItem/index';
import {useHistory} from 'react-router-dom'

function LinksList({selectedAlbum, setLinksList, linksList, chooseLink}) {
    const history = useHistory();
    const [isLoading, handleLoading] = useState(true);

    const fetchList = () => {
        handleLoading(true);
        if (!selectedAlbum) {
            history.push('/');
            return;
        }
        getLinksList(selectedAlbum)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw new Error(res.error);
                }
                setLinksList(res)
            })
            .catch(err => {
                alert(err)
            })
            .finally(() => {
                handleLoading(false)
            });
    };

    useEffect(() => {
        fetchList();
        return () => {
            setLinksList({})
        }
    }, [selectedAlbum, getLinksList]);

    const linksItemList = linksList.links && linksList.links.map(link => {
        return <AlbumListItem text={link} key={link}
                              handleDelete={() => {
                                  if (!window.confirm('Все изображения будут удалены. Продолжить?')) return;
                                  deleteLink(linksList.recordId, link)
                                      .then(res => res.json())
                                      .then(res => {
                                          fetchList()
                                      })
                              }}
                              handleClick={() => {
                                  chooseLink({recordId: linksList.recordId, url: link});
                                  history.push('/images')
                              }}/>
    });


    return (
        <>
            <div><span className={"nav-btn"} onClick={() => {
                history.push('/')
            }}> На главную </span></div>
            {isLoading ? null :
                <>
                    <ul className={'album-list'}>
                        {linksItemList}
                    </ul>
                    {linksList.links && linksList.links.length ? null : <p>Ссылок нет</p>}
                </>
            }
        </>
    )
}

export default LinksList