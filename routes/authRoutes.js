const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const authController = require("../controllers/authController");

router.get("/register", authController.showRegisterPage);
router.post("/register", authController.registerOrganization);
router.get("/login", authController.showLoginPage);
router.post("/login", authController.loginOrganization);

router.get("/organizations", authController.showOrganizations);
router.get("/protected", authMiddleware.isLoggedIn, (req, res) => {
    res.send(
        "Logged in organization: " +
        req.session.user.name +
        " | ID: " +
        req.session.user.id
    );
});

module.exports = router;