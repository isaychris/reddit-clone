const express = require("express");
const router = express.Router();

// CONTROLLERS
let settings_controller = require("../controllers/settings_controller")

// ROUTES
router.get('/settings', authenticateUser(), settings_controller.view);
router.put('/settings/change/password', settings_controller.change_password);
router.delete('/settings/delete/account', settings_controller.delete_account);

// MIDDLEWARE
function authenticateUser() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("login");
    };
}

module.exports = router