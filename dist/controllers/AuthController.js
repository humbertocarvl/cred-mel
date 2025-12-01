"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user || !user.active)
        return res.status(401).json({ message: 'Usuário não encontrado ou inativo' });
    const valid = await (0, hash_1.comparePassword)(password, user.password);
    if (!valid)
        return res.status(401).json({ message: 'Senha inválida' });
    const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
    res.json({ token });
};
exports.login = login;
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hash = await (0, hash_1.hashPassword)(password);
    const user = await prismaClient_1.default.user.create({ data: { name, email, password: hash, role } });
    res.status(201).json(user);
};
exports.register = register;
//# sourceMappingURL=AuthController.js.map