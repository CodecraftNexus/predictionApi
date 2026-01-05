"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyPost = ApiKeyPost;
exports.getApiKey = getApiKey;
exports.putApikey = putApikey;
const db_1 = require("../db");
function ApiKeyPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = req.body;
        if (!apiKey) {
            return res.status(400).json({ success: false, message: "Api key required" });
        }
        try {
            yield db_1.db.ApiKey.create({
                key: apiKey,
            });
            res.status(200).json({
                success: true,
                message: "Api key is Added"
            });
        }
        catch (error) {
            console.error("Add Api Error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function getApiKey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKeyId } = req.query;
        if (!apiKeyId) {
            return res.status(400).json({ success: false, message: "Api key id required" });
        }
        try {
            const ApiKey = yield db_1.db.ApiKey.findByPk(apiKeyId);
            if (!ApiKey) {
                return res.status(404).json({ success: false, message: "Api key not found" });
            }
            return res.status(200).json({
                success: true,
                ApiKey: {
                    id: ApiKey.id,
                    key: `${ApiKey.key.slice(0, 8)}...${ApiKey.key.slice(-4)}`
                }
            });
        }
        catch (error) {
            console.error("Get Api Error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function putApikey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, apikeyId } = req.body;
        if (!apiKey || !apikeyId) {
            return res.status(400).json({ success: false, message: "Api key and Api key id are required" });
        }
        try {
            const findApiKey = yield db_1.db.ApiKey.findByPk(apikeyId);
            if (!findApiKey) {
                return res.status(404).json({ success: false, message: "Api key not found" });
            }
            yield findApiKey.update({ key: apiKey });
            return res.status(200).json({ success: true, message: "Api key is Updated" });
        }
        catch (error) {
            console.error("Update Api Error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
