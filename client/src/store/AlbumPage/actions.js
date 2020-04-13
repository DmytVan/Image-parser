export const SET_HOSTNAME_LIST = 'SET_HOSTNAME_LIST';
export const SET_LINKS_LIST = 'SET_LINKS_LIST';
export const SET_IMAGES = 'SET_IMAGES';
export const CHOOSE_ALBUM = 'CHOOSE_ALBUM';
export const CHOOSE_LINK = 'CHOOSE_LINK';


export const setHostnameList = (hostnameList) => ({
    type: SET_HOSTNAME_LIST,
    hostnameList
});

export const setLinksList = (linksList) => ({
    type: SET_LINKS_LIST,
    linksList
});

export const setImages = (images) => ({
    type: SET_IMAGES,
    images
});

export const chooseAlbum = (id) => ({
    type: CHOOSE_ALBUM,
    id
});

export const chooseLink = (link) => ({
    type: CHOOSE_LINK,
    link
});
