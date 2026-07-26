"use strict";
//src/routes/task.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.authenticateJWT, task_controller_1.createTask);
router.put("/:id", auth_middleware_1.authenticateJWT, task_controller_1.updateTask);
router.delete("/:id", auth_middleware_1.authenticateJWT, task_controller_1.deleteTask);
exports.default = router;
