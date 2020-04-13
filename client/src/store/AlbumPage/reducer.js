import {
    SET_HOSTNAME_LIST,
    CHOOSE_ALBUM,
    SET_LINKS_LIST,
    CHOOSE_LINK,
    SET_IMAGES
} from "./actions";

const initialState = {
    hostnameList: [],
    selectedAlbum: null,
    linksList: [],
    selectedLink: null,
    albumsDirectory: 'dist/',
    imagesList: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_HOSTNAME_LIST:
            return {...state, hostnameList: action.hostnameList};
        case CHOOSE_ALBUM:
            return {...state, selectedAlbum: action.id};
        case SET_LINKS_LIST:
            return {...state, linksList: action.linksList};
        case CHOOSE_LINK:
            return {...state, selectedLink: action.link};
        case SET_IMAGES:
            return {...state, imagesList: action.images};
        default:
            return state;
    }
};

export default reducer;