const express = require("express");
const clientUserRouter = require("./user")
const router = express.Router()

router.use(clientUserRouter)

module.exports = router
