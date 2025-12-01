"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MealController_1 = require("../controllers/MealController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// create meal (scanner posts to POST /api/meals)
router.post('/', auth_1.authenticateJWT, MealController_1.registerMeal);
router.post('/register', auth_1.authenticateJWT, MealController_1.registerMeal);
router.get('/', auth_1.authenticateJWT, MealController_1.getMeals);
exports.default = router;
//# sourceMappingURL=mealRoutes.js.map