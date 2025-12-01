"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMealOption = exports.updateMealOption = exports.createMealOption = exports.getMealOptions = void 0;
const getMealOptions = async (req, res) => {
    const prisma = req.app.get('prisma');
    const options = await prisma.mealOption.findMany();
    res.json(options);
};
exports.getMealOptions = getMealOptions;
const createMealOption = async (req, res) => {
    const prisma = req.app.get('prisma');
    const { name, description } = req.body;
    const option = await prisma.mealOption.create({ data: { name, description } });
    res.status(201).json(option);
};
exports.createMealOption = createMealOption;
const updateMealOption = async (req, res) => {
    const prisma = req.app.get('prisma');
    const { id } = req.params;
    const { name, description } = req.body;
    const option = await prisma.mealOption.update({
        where: { id: Number(id) },
        data: { name, description },
    });
    res.json(option);
};
exports.updateMealOption = updateMealOption;
const deleteMealOption = async (req, res) => {
    const prisma = req.app.get('prisma');
    const { id } = req.params;
    await prisma.mealOption.delete({ where: { id: Number(id) } });
    res.status(204).send();
};
exports.deleteMealOption = deleteMealOption;
//# sourceMappingURL=MealOptionController.js.map