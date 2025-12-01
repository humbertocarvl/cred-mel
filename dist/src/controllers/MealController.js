"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeals = exports.registerMeal = void 0;
const registerMeal = async (req, res) => {
    try {
        const prisma = req.app.get('prisma');
        const { participantId, mealOptionId, date } = req.body;
        if (!participantId || !mealOptionId)
            return res.status(400).json({ message: 'participantId e mealOptionId são obrigatórios' });
        const mealDate = date ? new Date(date) : new Date();
        // check same-day duplicate: find any meal for this participant + mealOption on the same calendar day
        const startOfDay = new Date(mealDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(mealDate);
        endOfDay.setHours(23, 59, 59, 999);
        const existing = await prisma.meal.findFirst({
            where: {
                participantId: Number(participantId),
                mealOptionId: Number(mealOptionId),
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            }
        });
        if (existing)
            return res.status(409).json({ message: 'Refeição já registrada para esta participante neste dia' });
        const created = await prisma.meal.create({
            data: {
                participantId: Number(participantId),
                mealOptionId: Number(mealOptionId),
                date: mealDate,
            },
        });
        res.status(201).json(created);
    }
    catch (error) {
        console.error('Erro ao registrar refeição:', error);
        res.status(500).json({ error: 'Erro ao registrar refeição', details: error });
    }
};
exports.registerMeal = registerMeal;
const getMeals = async (req, res) => {
    try {
        const prisma = req.app.get('prisma');
        const { participantId, mealOptionId } = req.query;
        // If participantId provided, return raw meal entries filtered (used by scanner)
        if (participantId) {
            const where = { participantId: Number(participantId) };
            if (mealOptionId)
                where.mealOptionId = Number(mealOptionId);
            const meals = await prisma.meal.findMany({ where });
            return res.json(meals);
        }
        // Otherwise return aggregated counts grouped by date (YYYY-MM-DD) and meal option name for dashboard
        const raw = await prisma.meal.findMany({ include: { mealOption: true } });
        // group by date string and mealOption.name
        const groups = {};
        raw.forEach((m) => {
            const d = m.date ? new Date(m.date).toISOString().slice(0, 10) : 'unknown';
            const type = m.mealOption?.name || 'Desconhecido';
            const key = `${d}::${type}`;
            if (!groups[key])
                groups[key] = { date: d, type, count: 0 };
            groups[key].count += 1;
        });
        const aggregated = Object.values(groups).map(g => ({ date: g.date, type: g.type, count: g.count }));
        res.json(aggregated);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar refeições', details: error });
    }
};
exports.getMeals = getMeals;
//# sourceMappingURL=MealController.js.map