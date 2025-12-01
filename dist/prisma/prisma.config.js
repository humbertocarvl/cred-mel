"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
const url = process.env.DATABASE_URL;
if (!url)
    throw new Error('Environment variable DATABASE_URL is required');
const cfg = {
    datasource: {
        provider: 'postgresql',
        url,
    },
};
exports.default = (0, config_1.defineConfig)(cfg);
//# sourceMappingURL=prisma.config.js.map