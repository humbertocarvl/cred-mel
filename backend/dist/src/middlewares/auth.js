"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'Token não fornecido' });
    const token = authHeader.split(' ')[1];
    const envSecret = process.env.JWT_SECRET;
    const secret = envSecret ? envSecret : '';
    if (!secret)
        return res.status(500).json({ message: 'JWT_SECRET não configurado no servidor' });
    // @ts-ignore
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err)
            return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
}
//# sourceMappingURL=auth.js.map