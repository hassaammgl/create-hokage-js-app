const { Router } = require('express');
const { validator } = require("../validators/validator");
const { controller } = require("../controllers/controller")

const router = new Router();

router.post("/create", validator, controller);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;