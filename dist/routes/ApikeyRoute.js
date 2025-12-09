"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiKeyController_1 = require("../controllers/apiKeyController");
const router = (0, express_1.Router)();
router.post("/Apikey", apiKeyController_1.ApiKeyPost);
router.get("/Apikey", apiKeyController_1.getApiKey);
router.put("/Apikey", apiKeyController_1.putApikey);
exports.default = router;
