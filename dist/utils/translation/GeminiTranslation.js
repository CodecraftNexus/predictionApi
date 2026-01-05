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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupportedLanguage = exports.getTranslationStats = exports.batchTranslateTexts = exports.translateLongText = exports.translateTextWithGoogle = void 0;
const bottleneck_1 = __importDefault(require("bottleneck"));
const limiter = new bottleneck_1.default({
    maxConcurrent: 5,
    minTime: 300,
    reservoir: 50,
    reservoirRefreshAmount: 50,
    reservoirRefreshInterval: 60 * 1000,
});
limiter.on("failed", (error, jobInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const id = jobInfo.options.id;
    if (error.message.includes("429") || error.message.includes("Too Many Requests")) {
        const waitTime = Math.min(5000 * (jobInfo.retryCount + 1), 30000);
        console.warn(`⚠️ Rate limit hit. Retrying in ${waitTime / 1000}s...`);
        return waitTime;
    }
    if (error.message.includes("fetch failed") || error.message.includes("ECONNRESET")) {
        console.warn(`🔄 Connection error. Retrying...`);
        return 2000;
    }
    return null;
}));
limiter.on("retry", (error, jobInfo) => {
    console.log(`🔄 Retry attempt ${jobInfo.retryCount} for translation`);
});
const translateTextWithGoogle = (text, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    if (!text || text.trim().length === 0) {
        throw new Error("Text cannot be empty");
    }
    if (text.length > 5000) {
        throw new Error("Text too long. Maximum 5000 characters per request");
    }
    try {
        const translateFunction = limiter.wrap(() => __awaiter(void 0, void 0, void 0, function* () {
            const targetLang = targetLanguage === 'si' ? 'si' : 'ta';
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            if (!response.ok) {
                throw new Error(`Google Translate error: ${response.status} ${response.statusText}`);
            }
            const data = yield response.json();
            if (!data || !Array.isArray(data) || !data[0]) {
                throw new Error("Invalid response structure from Google Translate");
            }
            const translations = data[0]
                .filter((segment) => segment && segment[0])
                .map((segment) => segment[0])
                .join('');
            if (!translations || translations.trim().length === 0) {
                throw new Error("Empty translation received from Google");
            }
            return translations.trim();
        }));
        const translatedText = yield translateFunction();
        return translatedText;
    }
    catch (error) {
        console.error(`❌ Google Translate error for ${targetLanguage}:`, error.message);
        throw new Error(`Failed to translate to ${targetLanguage}: ${error.message}`);
    }
});
exports.translateTextWithGoogle = translateTextWithGoogle;
const translateLongText = (text_1, targetLanguage_1, ...args_1) => __awaiter(void 0, [text_1, targetLanguage_1, ...args_1], void 0, function* (text, targetLanguage, chunkSize = 4500) {
    if (text.length <= chunkSize) {
        return (0, exports.translateTextWithGoogle)(text, targetLanguage);
    }
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';
    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize) {
            if (currentChunk)
                chunks.push(currentChunk.trim());
            currentChunk = sentence;
        }
        else {
            currentChunk += sentence;
        }
    }
    if (currentChunk)
        chunks.push(currentChunk.trim());
    const translatedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
        console.log(`🔄 Translating chunk ${i + 1}/${chunks.length}...`);
        const translated = yield (0, exports.translateTextWithGoogle)(chunks[i], targetLanguage);
        translatedChunks.push(translated);
    }
    return translatedChunks.join(' ');
});
exports.translateLongText = translateLongText;
const batchTranslateTexts = (texts, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    const results = new Map();
    for (const text of texts) {
        try {
            const translated = yield (0, exports.translateTextWithGoogle)(text, targetLanguage);
            results.set(text, translated);
        }
        catch (error) {
            console.error(`Failed to translate: "${text.substring(0, 50)}..."`, error.message);
            results.set(text, text);
        }
    }
    return results;
});
exports.batchTranslateTexts = batchTranslateTexts;
const getTranslationStats = () => {
    return {
        running: limiter.counts().RUNNING,
        queued: limiter.counts().QUEUED,
        done: limiter.counts().DONE,
        reservoir: limiter.currentReservoir()
    };
};
exports.getTranslationStats = getTranslationStats;
const isSupportedLanguage = (language) => {
    const supportedLanguages = ['si', 'ta', 'en'];
    return supportedLanguages.includes(language);
};
exports.isSupportedLanguage = isSupportedLanguage;
