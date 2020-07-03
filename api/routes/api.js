var express = require('express');
var router = express.Router();
const fs = require("fs");
const multer = require("multer");
var path = require('path');

var model = require('../models/api');

const upload = multer({
    dest: path.join(__dirname, "../public/images/tmp")
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.post('/', upload.single("file"), (req, res, next) => {
    const {title, des, rating} = req.body;

    if (!title) {
        return res.status(400).send("Please provide a title!");
    }

    if (!des) {
        des = "Great film!";
    }
    if (!rating) {
        rating = -1;
    }

    model.getAll(docs => {
        if (!docs) {
            return res.status(400).send("Please provide a title!");
        }
        for (doc of docs) {
            if (title == doc.title) {
                return res.status(400).send("This title already exists in database!");
            }
        }
        if (req.file) {
            const img = req.file.originalname;
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, "../public/images/uploads/", req.file.originalname);
            const extName = path.extname(req.file.originalname).toLowerCase();
    
            if (extName === ".png" || extName === ".jpg" || extName === ".jpeg" || extName === ".gif" || extName === ".apng" || extName === ".svg" || extName === ".bmp" || extName === ".ico") {
                fs.rename(tempPath, targetPath, err => {
                    if (err) return res.status(400).send("Image upload went wrong!");
    
                    model.insert(title, des, rating, img, ret => {
                        if (ret.insertedCount != 1) {
                            res.status(400);
                            return res.send("insert failed");
                        } else {
                            res.status(201);
                            return res.json({
                                title:title,
                                description:des,
                                rating:rating,
                                img:img
                            });
                        }
                    });
                });
            } else {
                fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);
    
                    res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only images are allowed!");
                });
            }
        } else {
            model.insert(title, des, rating, "", ret => {
                if (ret.insertedCount != 1) {
                    res.status(400);
                    return res.send("insert failed");
                } else {
                    res.status(201);
                    return res.json({
                        title:title,
                        description:des,
                        rating:rating,
                        img:""
                    });
                }
            });
        }
    });
});

router.get('/', (req, res) => {
    model.getAll(docs => {
        if (!docs) {
            return res.status(400).send("Got nothing from database!");
        }
        res.json(docs);
    })
});

router.get('/:title', (req, res) => {
    const {title} = req.params;
    console.log(title);
    model.getFilm(title, docs => {
        if (!docs || docs.length != 1) {
            return res.status(400).send("Something wrong with database!");
        }
        res.json(docs[0]);
    });
});

router.delete('/:title', (req, res) => {
    const {title} = req.params;
    model.delete(title, ret => {
        if (ret.deletedCount != 1) {
            res.status(400);
            return res.send("no such post");
        } else {
            res.status(204);
            return res.send("delete success");
        }
    });
});

module.exports = router;
