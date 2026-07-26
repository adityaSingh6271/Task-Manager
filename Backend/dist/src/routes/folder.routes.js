"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/folder.routes.ts
const express_1 = require("express");
const folder_controller_1 = require("../controllers/folder.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/get", auth_middleware_1.authenticateJWT, folder_controller_1.getFolders);
router.post("/create", auth_middleware_1.authenticateJWT, folder_controller_1.createFolder);
router.put("/:id", auth_middleware_1.authenticateJWT, folder_controller_1.updateFolder);
router.delete("/:id", auth_middleware_1.authenticateJWT, folder_controller_1.deleteFolder);
exports.default = router;
