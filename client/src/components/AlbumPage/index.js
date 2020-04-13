import React from 'react';
import './index.css'
import {connect} from 'react-redux'
import NewAlbumForm from './NewAlbumForm'
import HostnameList from "./HostnameList";
import LinksList from './LinksList';
import ImagesList from './ImagesList'
import {setHostnameList, chooseAlbum, setLinksList, chooseLink, setImages} from "../../store/AlbumPage/actions";
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'


function AlbumPage(props) {
    const {setHostnameList, selectedAlbum, setLinksList, linksList, chooseLink, selectedLink, setImages, albumsDirectory, imagesList, chooseAlbum} = props;
    return (
        <div>
            <BrowserRouter>
            <NewAlbumForm setHostnameList={setHostnameList} selectedAlbum={selectedAlbum} chooseAlbum={chooseAlbum} setLinksList={setLinksList} chooseLink={chooseLink}/>
                <Switch>
                    <Route exact path='/'>
                        <HostnameList {...props}/>
                    </Route>
                    <Route path='/links'>
                        <LinksList selectedAlbum={selectedAlbum} setLinksList={setLinksList} linksList={linksList} chooseLink={chooseLink}/>
                    </Route>
                    <Route path='/images'>
                        <ImagesList selectedLink={selectedLink} setImages={setImages} albumsDirectory={albumsDirectory} imagesList={imagesList}/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
)
}

const putStateToProps = (state) => ({...state.albumPage});

const putActionsToProps = {
    setHostnameList,
    chooseAlbum,
    setLinksList,
    chooseLink,
    setImages
};

export default connect(putStateToProps, putActionsToProps)(AlbumPage);