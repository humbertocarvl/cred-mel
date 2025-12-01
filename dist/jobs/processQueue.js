"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processQueue = processQueue;
const queueService_1 = require("../services/queueService");
async function processQueue(queue, handler) {
    let item;
    while ((item = await (0, queueService_1.dequeueCriticalOperation)(queue))) {
        await handler(item);
    }
}
//# sourceMappingURL=processQueue.js.map