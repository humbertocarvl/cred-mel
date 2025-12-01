"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateJWT, UserController_1.getUsers);
router.post('/', auth_1.authenticateJWT, UserController_1.createUser);
router.put('/:id', auth_1.authenticateJWT, UserController_1.updateUser);
router.patch('/:id/toggle', auth_1.authenticateJWT, UserController_1.toggleUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map