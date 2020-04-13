const express = require('express');
const cheerio = require("cheerio");
const Nightmare = require('nightmare');
const sizeOf = require('image-size');
const url = require('url');
const https = require('https');
const fs = require('fs-extra');
const parseDataURL = require("data-urls");
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const settle = require('promise-settle');
const Albums = mongoose.model('Albums');
const albumsDirectory = 'public/dist/';
const router = express.Router();

router.get('/all', function (req, res, next) {
    Albums.find({}, {hostname: true})
        .then(result => {
            res.json(result)
        })
});

router.get('/linksById', function (req, res, next) {
    const {recordId} = req.query;
    Albums.findById(recordId, {list: true})
        .then(result => {
            res.json({
                links: result.list.map(item => item.url),
                recordId
            })
        })
        .catch(err => {
            res.json({error: err.messages})
        });
});

router.post('/images', function (req, res, next) {
    const {recordId, url} = req.body;
    Albums.findOne({_id: recordId, list: {$elemMatch: {url}}}, {'list.$': true})
        .then((result) => {
            result && res.json({
                path: result.list[0].path,
                images: result.list[0].images
            })
        })
        .catch(err => {
            res.json(err.message)
        })

});

router.delete('/albumsByHostname', function (req, res, next) {
    const {recordId} = req.body;
    Albums.findById(recordId)
        .then(async result => {
            if (!result) {
                return res.json({error: 'Album not found!'})
            }
            await fsDelete(result.hostname);
            await Albums.deleteOne({_id: recordId});
            res.json({ok: 'ok'})
        })
        .catch(err => {
            res.json({error: err.message})
        });

});

router.delete('/link', function (req, res, next) {
    const {recordId, url} = req.body;
    Albums.findOne({_id: recordId, list: {$elemMatch: {url}}}, {'list.$': true})
        .then(async result => {
            if (!result) {
                return res.json({error: 'Album not found!'})
            }
            await fsDelete(result.list[0].path);
            await Albums.updateOne({_id: recordId}, {$pull: {list: {url}}})
            res.json({ok: 'ok'})
        })
        .catch(err => {
            res.json({error: err.message})
        });
});

router.delete('/image', function (req, res, next) {
    const {recordId, url, name, path} = req.body;
    Albums.updateOne({_id: recordId, list: {$elemMatch: {url}}}, {$pull: {"list.$.images": {name}}})
        .then(res => {
            return fsDelete(path+'/'+name)
        })
        .then(() => {
            res.json({ok: 'ok'})
        })
        .catch(err => {
            res.json({error: err.message})
        });
});

router.post('/create', function (req, res, next) {
    const {pageUrl} = req.body;
    const parseUrl = url.parse(pageUrl);
    const {hostname} = parseUrl;
    const path = `${hostname}/${+new Date()}`;
    const album = {path, url: parseUrl.href, images: []};
    const nightmare = Nightmare({show: false, gotoTimeout: 8000});
    nightmare
        .goto(pageUrl)
        .wait('body')
        .evaluate(() => document.querySelector('body').innerHTML)
        .end()
        .then(response => {
            return getImageLinks(response, parseUrl);
        })
        .then((imageLinks) => {
            return downloadImages(imageLinks, album)
        })
        .then(() => {
            return Albums.findOne({hostname});
        })
        .then(async (result) => {
            if (!result) {
                const newAlbum = new Albums({hostname, list: [album]});
                return newAlbum.save();
            }
            const oldAlbums = await Albums.find({hostname, list: {$elemMatch: {url: parseUrl.href}}});
            if (oldAlbums.length) {
                for (let i = 0; i < oldAlbums.length; i++) {
                    for (let j = 0; j < oldAlbums[i].list.length; j++) {
                        if (oldAlbums[i].list[j].url === parseUrl.href) {
                            await fsDelete(oldAlbums[i].list[j].path);
                        }
                    }
                }
                await Albums.updateMany({hostname}, {$pull: {list: {url: parseUrl.href}}})
            }
            return Albums.findOneAndUpdate({hostname}, {$push: {list: album}})
        })
        .then((newAlbum) => {
            console.log('------end-------');
            return res.json({id: newAlbum._id, url: parseUrl.href})
        }).catch(err => {
        res.json({error: err.message});
        console.log(err)
    })
});

let getImageLinks = async (html, parseUrl) => {

    const imageLinks = [];
    const $ = cheerio.load(html);
    const links = $("img");

    links.each(function (i, link) {
        if (!link) {
            return;
        }

        let src = $(link).attr("src");

        if (!src) {
            return;
        }

        if (src.charAt(0) === "/") {
            src = parseUrl.protocol + '//' + parseUrl.hostname + src;
        }

        imageLinks.push(src);
    });

    return Promise.resolve(imageLinks);
};

function downloadImages(imageLinks, album) {
    return settle(imageLinks.map((imgUrl) => {
        if (imgUrl.startsWith('data')) {
            const buffer = parseDataURL(imgUrl);
            return saveImageByBuffer(buffer.body, imgUrl, album);
        }
        return new Promise((resolve, reject) => {
            https.get(imgUrl, function (response) {
                const chunks = [];
                response.on('data', function (chunk) {
                    chunks.push(chunk);
                }).on('end', function () {
                    const buffer = Buffer.concat(chunks);
                    saveImageByBuffer(buffer, imgUrl, album)
                        .then(resolve)
                }).on('error', function (err) {
                    console.log(err);
                    reject(err)
                });
            });
        })

    }))
}

function saveImageByBuffer(buffer, imgUrl, album) {
    return new Promise((resolve, reject) => {
        const {height, width, type} = sizeOf(buffer);
        if (height < 250 || width < 250) {
            reject('Image so small');
            return;
        }
        !fs.existsSync(albumsDirectory + album.path) && fs.mkdirSync(albumsDirectory + album.path, {recursive: true});
        const name = new ObjectID + '.' + type;
        fs.promises.writeFile(albumsDirectory + album.path + '/' + name, buffer)
            .then(() => {
                album.images.push({name: name, originalPath: imgUrl});
                resolve();
            })
            .catch(e => {
                console.log(e.message);
                reject(e);
            });
    })
        .catch(e => {
            console.log(e)
        })
}

function fsDelete(path,) {
    return new Promise((resolve, reject) => {
        fs.remove(albumsDirectory + path, err => {
            if (err) return reject(err);
            resolve();
        });
    });
}


module.exports = router;
