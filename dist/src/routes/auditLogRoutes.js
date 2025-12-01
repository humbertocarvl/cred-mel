"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuditLogController_1 = require("../controllers/AuditLogController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateJWT, AuditLogController_1.getAuditLogs);
exports.default = router;
//# sourceMappingURL=auditLogRoutes.js.map