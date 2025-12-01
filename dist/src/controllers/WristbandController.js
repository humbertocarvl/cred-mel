"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnassignedParticipants = exports.assignWristband = void 0;
const assignWristband = async (req, res) => {
    // TODO: Vincular pulseira à participante
    res.status(201).json({});
};
exports.assignWristband = assignWristband;
const getUnassignedParticipants = async (req, res) => {
    // TODO: Buscar participantes sem pulseira
    res.json([]);
};
exports.getUnassignedParticipants = getUnassignedParticipants;
//# sourceMappingURL=WristbandController.js.map