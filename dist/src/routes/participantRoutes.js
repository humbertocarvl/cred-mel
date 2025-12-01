"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ParticipantController_1 = require("../controllers/ParticipantController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateJWT, ParticipantController_1.getParticipants);
router.post('/', auth_1.authenticateJWT, ParticipantController_1.createParticipant);
router.post('/bulk', auth_1.authenticateJWT, ParticipantController_1.bulkCreateParticipants);
router.put('/:id', auth_1.authenticateJWT, ParticipantController_1.updateParticipant);
exports.default = router;
//# sourceMappingURL=participantRoutes.js.map