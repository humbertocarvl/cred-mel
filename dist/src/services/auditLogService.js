"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = logAction;
const database_1 = __importDefault(require("../config/database"));
async function logAction(userId, action, details) {
    await database_1.default.query('INSERT INTO "AuditLog" ("userId", action, details, "created_at") VALUES ($1, $2, $3, NOW())', [userId, action, details]);
}
//# sourceMappingURL=auditLogService.js.map