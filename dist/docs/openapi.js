"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpec = void 0;
const env_1 = require("../config/env");
const isDev = env_1.env.NODE_ENV !== "production";
exports.openApiSpec = {
    openapi: "3.1.0",
    info: {
        title: "Horoscope API",
        version: "1.0.0",
        description: isDev
            ? "Development Mode → Login returns access_token & refresh_token in JSON. Copy access_token → click top-right 'Authorize' → paste → test everything!"
            : "Production Mode → Authentication via secure httpOnly cookies only (no tokens in response body).",
    },
    servers: [{ url: env_1.env.base_Url, description: "Development" }],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Development only → paste access_token from /login response here",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string", example: "42" },
                    name: { type: "string", example: "Kasun Perera" },
                    email: { type: "string", format: "email", example: "kasun@gmail.com" },
                    username: { type: "string", example: "kasun123" },
                    dateOfBirth: { type: "string", format: "date", nullable: true },
                    birthTime: { type: "string", nullable: true },
                    location: {
                        type: "object",
                        nullable: true,
                        properties: {
                            latitude: { type: "number", example: 6.9271 },
                            longitude: { type: "number", example: 79.8612 },
                            name: { type: "string", example: "Colombo, Sri Lanka" },
                        },
                    },
                    gender: { type: "string", enum: ["male", "female", "other"], nullable: true },
                    whatsapp: { type: "string", nullable: true, example: "+94771234567" },
                },
            },
            Success: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                },
            },
            ApiKey: {
                type: "object",
                properties: {
                    id: { type: "string", example: "1" },
                    key: { type: "string", example: "sk-1234...abcd" },
                },
            },
            PlanetHouseResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Horoscope generated and saved successfully" },
                    result: { type: "object" },
                },
            },
        },
    },
    security: [{ BearerAuth: [] }],
    paths: {
        "/api/auth/google-login": {
            post: {
                summary: "Google Login (1-click)",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["idToken"],
                                properties: {
                                    idToken: { type: "string", description: "Google ID token from frontend" },
                                },
                                example: { idToken: "eyJhbGciOiJSUzI1NiIs..." },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: isDev
                            ? "Login success → copy access_token → click Authorize"
                            : "Login success → tokens set in HttpOnly cookies",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: Object.assign({ success: { type: "boolean", example: true }, requiresUsername: { type: "boolean", example: true, description: "true = user must set username first" }, user: { $ref: "#/components/schemas/User" } }, (isDev && {
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    })),
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/set-username": {
            post: {
                summary: "Set username (required after first Google login)",
                tags: ["Auth"],
                security: isDev ? [{ BearerAuth: [] }] : [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["username"],
                                properties: {
                                    username: {
                                        type: "string",
                                        minLength: 3,
                                        maxLength: 20,
                                        pattern: "^[a-zA-Z0-9](?!.*[._-]{2})[a-zA-Z0-9._-]*[a-zA-Z0-9]$",
                                        description: "Letters, numbers, ., _, - only. Cannot start/end with special chars",
                                    },
                                },
                                example: { username: "kasun123" },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Username set → full access granted",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: Object.assign({ success: { type: "boolean", example: true }, user: { $ref: "#/components/schemas/User" } }, (isDev && {
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    })),
                                },
                            },
                        },
                    },
                    "400": { description: "Invalid or taken username" },
                },
            },
        },
        "/api/auth/register": {
            post: {
                summary: "Register new user",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fullName", "email", "password", "username"],
                                properties: {
                                    fullName: { type: "string", minLength: 2 },
                                    email: { type: "string", format: "email" },
                                    username: { type: "string", minLength: 3 },
                                    password: { type: "string", minLength: 8 },
                                },
                                example: {
                                    fullName: "Kasun Perera",
                                    email: "kasun@gmail.com",
                                    username: "kasun123",
                                    password: "mypassword123",
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User created",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
                    },
                    "409": { description: "Email or username taken" },
                },
            },
        },
        "/api/auth/login": {
            post: {
                summary: "Login → returns tokens in JSON (dev only)",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string" },
                                },
                                example: { email: "kasun@gmail.com", password: "mypassword123" },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Login successful → copy access_token → click Authorize",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: Object.assign({ success: { type: "boolean", example: true }, message: { type: "string" }, user: { $ref: "#/components/schemas/User" } }, (isDev && {
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    })),
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/refresh": {
            post: {
                summary: "Refresh token (dev: accepts body, prod: reads cookie)",
                tags: ["Auth"],
                requestBody: isDev
                    ? {
                        content: {
                            "application/json": {
                                schema: { type: "object", properties: { refreshToken: { type: "string" } } },
                            },
                        },
                    }
                    : undefined,
                responses: {
                    "200": {
                        description: "New tokens issued",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: Object.assign({ success: { type: "boolean" }, message: { type: "string" } }, (isDev && {
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    })),
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/auth/logout": {
            post: {
                summary: "Logout current device",
                tags: ["Auth"],
                requestBody: isDev
                    ? {
                        content: {
                            "application/json": {
                                schema: { type: "object", properties: { refreshToken: { type: "string" } } },
                            },
                        },
                    }
                    : undefined,
                responses: { "200": { $ref: "#/components/schemas/Success" } },
            },
        },
        "/api/profile": {
            get: {
                summary: "Get my profile",
                tags: ["Profile"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Profile retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: [
                                        { $ref: "#/components/schemas/User" },
                                        {
                                            type: "object",
                                            properties: {
                                                isProfileComplete: { type: "boolean", example: false },
                                                birthLocation: { type: "string", example: "Colombo, Sri Lanka" },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            put: {
                summary: "Update profile",
                tags: ["Profile"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    dateOfBirth: { type: "string", format: "date" },
                                    birthTime: { type: "string", example: "14:30:00" },
                                    latitude: { type: "number", example: 6.9271 },
                                    longitude: { type: "number", example: 79.8612 },
                                    birthLocation: { type: "string", example: "Colombo, Sri Lanka" },
                                    gender: { type: "string", enum: ["Male", "Female", "Other"] },
                                    whatsappNumber: { type: "string", example: "+94771234567" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Profile updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Profile updated successfully" },
                                        user: { $ref: "#/components/schemas/User" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/Apikey": {
            post: {
                summary: "Add new API key",
                tags: ["API Key"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["apiKey"],
                                properties: {
                                    apiKey: { type: "string", description: "API key to store" },
                                },
                                example: { apiKey: "sk-1234567890abcdef" },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "API key added successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Api key is Added" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "API key required" },
                    "500": { description: "Server error" },
                },
            },
            get: {
                summary: "Get API key by ID",
                tags: ["API Key"],
                parameters: [
                    {
                        name: "apiKeyId",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        description: "API key ID to retrieve",
                        example: "1",
                    },
                ],
                responses: {
                    "200": {
                        description: "API key retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        ApiKey: { $ref: "#/components/schemas/ApiKey" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "API key ID required" },
                    "404": { description: "API key not found" },
                    "500": { description: "Server error" },
                },
            },
            put: {
                summary: "Update API key",
                tags: ["API Key"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["apiKey", "apikeyId"],
                                properties: {
                                    apiKey: { type: "string", description: "New API key value" },
                                    apikeyId: { type: "string", description: "API key ID to update" },
                                },
                                example: { apiKey: "sk-newkey9876543210", apikeyId: "1" },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "API key updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Api key is Updated" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "API key and API key ID are required" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/planethouse": {
            post: {
                summary: "Generate and save planet house horoscope",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                description: "Fetches planet house data from external API and saves it for the authenticated user",
                responses: {
                    "200": {
                        description: "Horoscope generated and saved successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/PlanetHouseResponse" },
                            },
                        },
                    },
                    "500": { description: "Internal server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/mahadasha": {
            post: {
                summary: "Generate and save Mahadasha data",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                description: "Fetches Mahadasha data from external API and saves it for the authenticated user",
                responses: {
                    "200": {
                        description: "Mahadasha generated and saved successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/PlanetHouseResponse" },
                            },
                        },
                    },
                    "500": { description: "Internal server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/anthardasha": {
            post: {
                summary: "Generate and save Anthar Dasha data",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                description: "Fetches Anthar Dasha data from external API and saves it for the authenticated user",
                responses: {
                    "200": {
                        description: "Anthar Dasha generated and saved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Anthar Dasha generated and saved successfully" },
                                        result: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Internal server error" },
                    "502": { description: "External API error" },
                },
            },
        },
    },
};
