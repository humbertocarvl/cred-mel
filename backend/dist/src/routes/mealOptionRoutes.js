"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MealOptionController_1 = require("../controllers/MealOptionController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateJWT, MealOptionController_1.getMealOptions);
router.post('/', auth_1.authenticateJWT, MealOptionController_1.createMealOption);
router.put('/:id', auth_1.authenticateJWT, MealOptionController_1.updateMealOption);
router.delete('/:id', auth_1.authenticateJWT, MealOptionController_1.deleteMealOption);
exports.default = router;
//# sourceMappingURL=mealOptionRoutes.js.map