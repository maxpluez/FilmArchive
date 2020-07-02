let client = require('../db');

module.exports.getAll = function (callback) {
    let collection = client.db('filmarchive').collection('films');
    collection.find({}).toArray(function(err, docs){
        callback(docs);
    });
}

module.exports.getFilm = function (title, callback) {
    let collection = client.db('filmarchive').collection('films');
    collection.find({'title':title}).toArray(function(err, docs){
        callback(docs);
    });
}

module.exports.insert = function (title, des, rating = -1, path = "", callback) {
    let collection = client.db('filmarchive').collection('films');
    collection.insertOne({'title': title, 'description': des, 'rating': rating, 'img': path}, function(err, ret) {
        callback(ret);
    });
}

module.exports.delete = function (title, callback) {
    let collection = client.db('filmarchive').collection('films');
    collection.deleteOne({'title': title}, function(err, ret) {
        callback(ret);
    });
}