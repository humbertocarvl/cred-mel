"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WristbandController_1 = require("../controllers/WristbandController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/assign', auth_1.authenticateJWT, WristbandController_1.assignWristband);
router.get('/unassigned', auth_1.authenticateJWT, WristbandController_1.getUnassignedParticipants);
exports.default = router;
//# sourceMappingURL=wristbandRoutes.js.map