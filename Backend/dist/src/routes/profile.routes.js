"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/profile.routes.ts
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/me", auth_middleware_1.authenticateJWT, profile_controller_1.getProfileData);
router.put("/me", auth_middleware_1.authenticateJWT, profile_controller_1.updateProfile);
exports.default = router;
