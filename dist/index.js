"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("./config/prismaClient"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const participantRoutes_1 = __importDefault(require("./routes/participantRoutes"));
const wristbandRoutes_1 = __importDefault(require("./routes/wristbandRoutes"));
const mealRoutes_1 = __importDefault(require("./routes/mealRoutes"));
const auditLogRoutes_1 = __importDefault(require("./routes/auditLogRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mealOptionRoutes_1 = __importDefault(require("./routes/mealOptionRoutes"));
const devRoutes_1 = __importDefault(require("./routes/devRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('prisma', prismaClient_1.default);
// CORS: permitir envio por formulários do painel e preflight (OPTIONS)
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
app.options('/*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('API Credenciamento e Refeições - Backend');
});
app.get('/api/_health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Rotas principais
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/participants', participantRoutes_1.default);
app.use('/api/wristbands', wristbandRoutes_1.default);
app.use('/api/meals', mealRoutes_1.default);
app.use('/api/audit-logs', auditLogRoutes_1.default);
app.use('/api/meal-options', mealOptionRoutes_1.default);
// Dev-only endpoints (no auth) to ease frontend testing
app.use('/api/_dev', devRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map