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
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("./db/sequelize");
const openapi_1 = require("./docs/openapi");
const env_1 = require("./config/env");
require("./db");
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const ApikeyRoute_1 = __importDefault(require("./routes/ApikeyRoute"));
const Adminroute_1 = __importDefault(require("./routes/Adminroute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
if (env_1.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
}));
app.use((0, cors_1.default)({
    origin: env_1.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
try {
    app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openApiSpec, {
        swaggerOptions: {
            persistAuthorization: true,
            withCredentials: true,
            requestInterceptor: (req) => {
                req.credentials = "include";
                return req;
            },
        },
    }));
    console.log(`📋 Swagger UI Ready → ${env_1.env.base_Url}/api/docs`);
}
catch (err) {
    console.warn("swagger-ui-express not installed → npm i swagger-ui-express");
}
app.use("/api/auth", AuthRoute_1.default);
app.use("/api", profileRoute_1.default);
app.use("/api", ApikeyRoute_1.default);
app.use("/api/admin", Adminroute_1.default);
function StartServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize_1.sequelize.authenticate();
            console.log("✅ Database connection established successfully.");
            if (env_1.env.NODE_ENV === "production") {
                console.log("⚠️ Production mode: Please run migrations manually using 'npm run migrate");
            }
            else {
                console.log("🔄️ Development mode: Syncing database models...");
                if (env_1.env.FORCE_SYNC === true) {
                    console.log("💡 FORCE_SYNC is enabled: All tables will be dropped and recreated. Data loss may occur!");
                }
                else {
                    console.log("💡 Tip: Set FORCE_SYNC=true in .env to recreate tables if needed");
                }
                yield sequelize_1.sequelize.sync({
                    force: env_1.env.FORCE_SYNC === true,
                    alter: false,
                    logging: false,
                });
                console.log("✅ Database models synchronized.");
            }
            app.listen(env_1.env.PORT, () => {
                console.log(`👍 Server runing on port ${env_1.env.PORT}`);
                console.log(`🌐 Server Url ${env_1.env.base_Url}`);
                console.log("Server Working healthy ✅");
            });
        }
        catch (error) {
            console.error("❌ Unable to start server :", error);
            process.exit(1);
        }
    });
}
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🛑 Shutting down server...");
    try {
        yield sequelize_1.sequelize.close();
        console.log("✅ Database connection closed.");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
}));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🛑 Received SIGTERM, shutting down gracefully...");
    try {
        yield sequelize_1.sequelize.close();
        console.log("✅ Database connection closed.");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
}));
StartServer().catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
});
