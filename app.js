const methodOverride = require('method-override')
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(express.static("public"));
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true });

const imageSchema = {
    ImgName: String,
    ImgURL: String,
    ImgDetails: String
};

const Image = mongoose.model("Image", imageSchema);

/*****************Routes for all images********************/

app.route("/")

    .get(function(req, res) {
        Image.find(function(err, foundImages) {
            if (!err) {
                res.render('default', { test: foundImages });
            } else {
                res.send(err);
            }
        });
    })

    .post(function(req, res) {

        const newImage = new Image({
            ImgName: req.body.imgName,
            ImgURL: req.body.imgURL,
            ImgDetails: req.body.imgDetails
        });

        newImage.save(function(err) {
            if (!err) {
                res.render('success-message', {message: "Added Image"});
            } else {
                res.send(err);
            }
        });
    });


/*****************Routes for specific image********************/

app.route("/show/:id")
    .get(function(req, res) {
        Image.findOne({ _id: req.params.id }, function(err, foundImage) {
            if (!err) {
                res.render('image-page', { image: foundImage });
            } else {
                res.send("No image with matching id found\n" + err);
            }
        });
    });

app.get("/new", function(req, res) {
    res.render('newImage-page');
});

app.route("/:id/edit")
    .get(function(req, res) {
        Image.findOne({ _id: req.params.id }, function(err, foundImage) {
            if (!err) {
                res.render('edit-page', { image: foundImage });
            } else {
                res.send("No image with matching id found\n" + err);
            }
        });
    })

    .put(function(req, res) {
        Image.updateOne({ _id: req.params.id },
        { $set: {ImgURL: req.body.ImgURL, ImgDetails: req.body.ImgDetails} },
        { overwrite: false },
            function(err, updateImage) {
                if (!err) {
                    res.redirect("/show/" + req.params.id);
                } else {
                    res.send(err);
                }
            }
        );
    });

app.delete("/delete/:id", function(req, res) {
    Image.deleteOne({ _id: req.params.id }, function(err) {
        if (!err) {
            
            res.render('success-message', {message: "deleted image."});
        } else {
            res.send(err);
        }
    });

});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});