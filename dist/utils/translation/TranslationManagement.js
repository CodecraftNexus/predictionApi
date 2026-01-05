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
exports.preloadCommonTranslations = exports.getCacheStats = exports.clearTranslationCache = exports.batchGetOrCreateTranslations = exports.getOrCreateTranslation = void 0;
const db_1 = require("../../db");
const GeminiTranslation_1 = require("./GeminiTranslation");
const translationCache = new Map();
const getCacheKey = (text, language) => {
    return `${language}:${text.trim().toLowerCase()}`;
};
const getOrCreateTranslation = (englishText, language) => __awaiter(void 0, void 0, void 0, function* () {
    if (!englishText || englishText.trim().length === 0) {
        return englishText;
    }
    try {
        const trimmedText = englishText.trim();
        const cacheKey = getCacheKey(trimmedText, language);
        if (translationCache.has(cacheKey)) {
            console.log(`⚡ Memory cache hit for ${language}: "${trimmedText.substring(0, 40)}..."`);
            return translationCache.get(cacheKey);
        }
        const existing = yield db_1.db.PredictionTranslation.findOne({
            where: {
                language: language,
                original_text: trimmedText
            }
        });
        if (existing) {
            translationCache.set(cacheKey, existing.translated_text);
            return existing.translated_text;
        }
        console.log(`→ Translating to ${language}: "${trimmedText.substring(0, 40)}..."`);
        const translatedText = yield (0, GeminiTranslation_1.translateTextWithGoogle)(trimmedText, language);
        yield db_1.db.PredictionTranslation.create({
            language: language,
            translated_text: translatedText,
            original_text: trimmedText
        });
        translationCache.set(cacheKey, translatedText);
        console.log(`✓ Translation completed and saved for ${language}`);
        const stats = (0, GeminiTranslation_1.getTranslationStats)();
        console.log(`📊 Queue - Running: ${stats.running}, Queued: ${stats.queued}, Done: ${stats.done}`);
        return translatedText;
    }
    catch (error) {
        console.error(`❌ Translation error for ${language}:`, error.message);
        console.warn(`⚠️ Returning original text as fallback`);
        return englishText;
    }
});
exports.getOrCreateTranslation = getOrCreateTranslation;
const batchGetOrCreateTranslations = (texts, language) => __awaiter(void 0, void 0, void 0, function* () {
    const results = new Map();
    const textsToTranslate = [];
    for (const text of texts) {
        const trimmedText = text.trim();
        if (!trimmedText) {
            results.set(text, text);
            continue;
        }
        const cacheKey = getCacheKey(trimmedText, language);
        if (translationCache.has(cacheKey)) {
            results.set(text, translationCache.get(cacheKey));
            continue;
        }
        const existing = yield db_1.db.PredictionTranslation.findOne({
            where: {
                language: language,
                original_text: trimmedText
            }
        });
        if (existing) {
            results.set(text, existing.translated_text);
            translationCache.set(cacheKey, existing.translated_text);
        }
        else {
            textsToTranslate.push(text);
        }
    }
    for (const text of textsToTranslate) {
        try {
            const translated = yield (0, exports.getOrCreateTranslation)(text, language);
            results.set(text, translated);
        }
        catch (error) {
            console.error(`Batch translation failed for: ${text}`, error);
            results.set(text, text);
        }
    }
    return results;
});
exports.batchGetOrCreateTranslations = batchGetOrCreateTranslations;
const clearTranslationCache = () => {
    const size = translationCache.size;
    translationCache.clear();
    console.log(`🗑️ Cleared ${size} cached translations`);
    return size;
};
exports.clearTranslationCache = clearTranslationCache;
const getCacheStats = () => {
    return {
        memoryCacheSize: translationCache.size,
        translationQueueStats: (0, GeminiTranslation_1.getTranslationStats)()
    };
};
exports.getCacheStats = getCacheStats;
const preloadCommonTranslations = (language) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🔄 Preloading common ${language} translations...`);
    const commonTranslations = yield db_1.db.PredictionTranslation.findAll({
        where: { language },
        limit: 1000,
        order: [['createdAt', 'DESC']]
    });
    for (const trans of commonTranslations) {
        const cacheKey = getCacheKey(trans.original_text, language);
        translationCache.set(cacheKey, trans.translated_text);
    }
    console.log(`✓ Preloaded ${commonTranslations.length} ${language} translations`);
    return commonTranslations.length;
});
exports.preloadCommonTranslations = preloadCommonTranslations;
