export const createAlbum = (ulr) => {
    const data = {pageUrl: ulr};
    return fetch('/api/albums/create', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
};

export const getAlbumsList = () => {
    return fetch('/api/albums/all');
};

export const deleteAlbumsByHostname = (id) => {
    const data = {recordId: id};
    return fetch('/api/albums/albumsByHostname', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
};

export const getLinksList = (id) => {
    return fetch(`/api/albums/linksById?recordId=${id}`)
};

export const deleteLink = (id, url) => {
    const data = {url: url, recordId: id};
    return fetch('/api/albums/link', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
};

export const getImages = (id, url) => {
    const data = {url: url, recordId: id};
    return fetch('/api/albums/images', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
};

export const deleteImage = (name, id, url, path) => {
    const data = {url, recordId: id, name, path};
    return fetch('/api/albums/image', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}