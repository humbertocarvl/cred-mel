"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueCriticalOperation = enqueueCriticalOperation;
exports.dequeueCriticalOperation = dequeueCriticalOperation;
const redis_1 = __importDefault(require("../config/redis"));
async function enqueueCriticalOperation(queue, data) {
    await redis_1.default.lpush(queue, JSON.stringify(data));
}
async function dequeueCriticalOperation(queue) {
    const item = await redis_1.default.rpop(queue);
    return item ? JSON.parse(item) : null;
}
//# sourceMappingURL=queueService.js.map