const mongoose = require('mongoose');


const {Schema} = mongoose;

// const AlbumsSchema = new Schema({
//     url: {
//         type: String,
//         required: true
//     },
//     path: {
//         type: String,
//         required: true
//     },
//     hostname: String,
//     images: []
// });

const AlbumsSchema = new Schema({
    list: [],
    hostname: String
});



mongoose.model('Albums', AlbumsSchema);