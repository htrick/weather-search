const router = require("express").Router();

router.route("/").get((req, res) => {
    res.render("locations");
});

// router.route("/:id").get((req, res) => {
//     Bookmark.find({user: req.user.email, num: parseInt(req.params.id)})
//         .then(bookmark => res.json(bookmark))
//         .catch(err => res.status(400).json("Error: " + err));
// });

// router.route("/").post((req, res) => {
//     const user = req.user.email;
//     const num = Number(req.body.num);
//     const group = Number(req.body.group);
//     const address = req.body.address;
//     const title = req.body.title;
//     const newBookmark = new Bookmark({user, num, group, address, title});
//     newBookmark.save()
//         .then(() => res.json(newBookmark))
//         .catch(err => res.status(400).json("Error: " + err));
// })

// router.route("/:id").delete((req, res) => {
//     Bookmark.find({user: req.user.email, num: parseInt(req.params.id)})
//         .then(bookmark => res.json(bookmark))
//         .catch(err => res.status(400).json("Error: " + err));
//     Bookmark.deleteOne({user: req.user.email, num: parseInt(req.params.id)})
//         .catch(err => res.status(400).json("Error: " + err));
// });

module.exports = router;
