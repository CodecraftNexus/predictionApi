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
    servers: [{ url: env_1.env.base_Url, description: "API Server" }],
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
                    nickname: { type: "string", example: "Kasu", nullable: true },
                    dateOfBirth: { type: "string", format: "date", nullable: true },
                    birthTime: { type: "string", nullable: true, example: "14:30:00" },
                    whatsappNumber: { type: "string", nullable: true, example: "+94771234567" },
                    gender: { type: "string", nullable: true },
                    isProfileComplete: { type: "boolean", example: false },
                    birthLocation: { type: "string", nullable: true },
                    latitude: { type: "number", nullable: true },
                    longitude: { type: "number", nullable: true },
                    reference: { type: "string", nullable: true },
                    profileImage: { type: "string", nullable: true },
                    jobs: { type: "array", items: { type: "string" } },
                    education: { type: "array", items: { type: "string" } },
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
            PlanetHouseData: {
                type: "object",
                properties: {
                    lagnaya: { type: "string" },
                    box1: { type: "array", items: { type: "string" } },
                    box2: { type: "array", items: { type: "string" } },
                    box3: { type: "array", items: { type: "string" } },
                    box4: { type: "array", items: { type: "string" } },
                    box5: { type: "array", items: { type: "string" } },
                    box6: { type: "array", items: { type: "string" } },
                    box7: { type: "array", items: { type: "string" } },
                    box8: { type: "array", items: { type: "string" } },
                    box9: { type: "array", items: { type: "string" } },
                    box10: { type: "array", items: { type: "string" } },
                    box11: { type: "array", items: { type: "string" } },
                    box12: { type: "array", items: { type: "string" } },
                },
            },
            DashaData: {
                type: "object",
                properties: {
                    dasha: { type: "string" },
                    from: { type: "string", format: "date" },
                    to: { type: "string", format: "date" },
                },
            },
            AntardashaData: {
                type: "object",
                properties: {
                    anthardhashawa: { type: "string" },
                    from: { type: "string", format: "date" },
                    to: { type: "string", format: "date" },
                },
            },
            PredictionData: {
                type: "object",
                properties: {
                    Predictionsname: { type: "string" },
                    "General Prediction": { type: "string" },
                    "Personalised Prediction": { type: "string" },
                    "Planet Zodiac Prediction": { type: "string" },
                    "Verbal Location": { type: "string" },
                },
            },
            AstrologicalDetailsData: {
                type: "object",
                properties: {
                    gana: { type: "string" },
                    yoni: { type: "string" },
                    vasya: { type: "string" },
                    nadi: { type: "string" },
                    varna: { type: "string" },
                    paya: { type: "string" },
                    paya_by_nakshatra: { type: "string" },
                    tatva: { type: "string" },
                    life_stone: { type: "string" },
                    lucky_stone: { type: "string" },
                    fortune_stone: { type: "string" },
                    name_start: { type: "string" },
                    ascendant_sign: { type: "string" },
                    ascendant_nakshatra: { type: "string" },
                    rasi: { type: "string" },
                    rasi_lord: { type: "string" },
                    nakshatra: { type: "string" },
                    nakshatra_lord: { type: "string" },
                    nakshatra_pada: { type: "string" },
                    sun_sign: { type: "string" },
                    tithi: { type: "string" },
                    karana: { type: "string" },
                    yoga: { type: "string" },
                    ayanamsa: { type: "string" },
                },
            },
        },
    },
    security: [{ BearerAuth: [] }],
    paths: {
        "/api/admin/planet-predictions": {
            post: {
                summary: "Create planet location prediction",
                description: "Admin only - Create a new prediction for a specific planet location and lagnaya",
                tags: ["Admin - Planet Predictions"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["lagnaya", "PredictionPlanetId", "planetlocation", "prediction"],
                                properties: {
                                    lagnaya: {
                                        type: "string",
                                        example: "Mesha",
                                        description: "Zodiac sign/lagnaya"
                                    },
                                    PredictionPlanetId: {
                                        type: "integer",
                                        example: 1,
                                        description: "ID of the planet"
                                    },
                                    planetlocation: {
                                        type: "string",
                                        example: "1",
                                        maxLength: 5,
                                        description: "Planet location (1-12)"
                                    },
                                    prediction: {
                                        type: "string",
                                        example: "This is a detailed prediction for Sun in house 1...",
                                        description: "Prediction text"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Prediction created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Planet location prediction created successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                lagnaya: { type: "string" },
                                                PredictionPlanetId: { type: "integer" },
                                                planetlocation: { type: "string" },
                                                prediction: { type: "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Missing required fields" },
                    "404": { description: "Planet not found" },
                    "401": { description: "Unauthorized - Admin auth required" },
                    "500": { description: "Server error" }
                }
            },
            get: {
                summary: "Get all planet predictions",
                description: "Public - Get all predictions with optional filters",
                tags: ["Public - Planet Predictions"],
                security: [],
                parameters: [
                    {
                        name: "lagnaya",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by lagnaya/zodiac sign",
                        example: "Mesha"
                    },
                    {
                        name: "planetId",
                        in: "query",
                        schema: { type: "integer" },
                        description: "Filter by planet ID",
                        example: 1
                    },
                    {
                        name: "planetlocation",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by planet location",
                        example: "1"
                    }
                ],
                responses: {
                    "200": {
                        description: "Predictions retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        count: { type: "integer", example: 10 },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer" },
                                                    lagnaya: { type: "string" },
                                                    PredictionPlanetId: { type: "integer" },
                                                    planetlocation: { type: "string" },
                                                    prediction: { type: "string" },
                                                    predictionPlanet: {
                                                        type: "object",
                                                        properties: {
                                                            id: { type: "integer" },
                                                            PlanetName: { type: "string" }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": { description: "Server error" }
                }
            }
        },
        "/api/admin/planet-predictions/search": {
            get: {
                summary: "Search prediction by details",
                description: "Public - Get specific prediction by lagnaya, planet, and location",
                tags: ["Public - Planet Predictions"],
                security: [],
                parameters: [
                    {
                        name: "lagnaya",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        description: "Lagnaya/zodiac sign",
                        example: "Mesha"
                    },
                    {
                        name: "planetId",
                        in: "query",
                        required: true,
                        schema: { type: "integer" },
                        description: "Planet ID",
                        example: 1
                    },
                    {
                        name: "planetlocation",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        description: "Planet location (1-12)",
                        example: "1"
                    }
                ],
                responses: {
                    "200": {
                        description: "Prediction found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                lagnaya: { type: "string" },
                                                PredictionPlanetId: { type: "integer" },
                                                planetlocation: { type: "string" },
                                                prediction: { type: "string" },
                                                predictionPlanet: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "integer" },
                                                        PlanetName: { type: "string" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Missing required parameters" },
                    "404": { description: "Prediction not found" },
                    "500": { description: "Server error" }
                }
            }
        },
        "/api/admin/planet-predictions/{id}": {
            get: {
                summary: "Get prediction by ID",
                description: "Public - Get specific prediction by its ID",
                tags: ["Public - Planet Predictions"],
                security: [],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "Prediction ID",
                        example: 123
                    }
                ],
                responses: {
                    "200": {
                        description: "Prediction found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                lagnaya: { type: "string" },
                                                PredictionPlanetId: { type: "integer" },
                                                planetlocation: { type: "string" },
                                                prediction: { type: "string" },
                                                predictionPlanet: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "integer" },
                                                        PlanetName: { type: "string" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": { description: "Prediction not found" },
                    "500": { description: "Server error" }
                }
            },
            put: {
                summary: "Update prediction",
                description: "Admin only - Update all fields of a planet location prediction",
                tags: ["Admin - Planet Predictions"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "Prediction ID",
                        example: 123
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    lagnaya: {
                                        type: "string",
                                        example: "Vrushabha",
                                        description: "New lagnaya (optional)"
                                    },
                                    PredictionPlanetId: {
                                        type: "integer",
                                        example: 2,
                                        description: "New planet ID (optional)"
                                    },
                                    planetlocation: {
                                        type: "string",
                                        example: "2",
                                        description: "New planet location (optional)"
                                    },
                                    prediction: {
                                        type: "string",
                                        example: "Updated prediction text...",
                                        description: "New prediction text (optional)"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Prediction updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Prediction updated successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                lagnaya: { type: "string" },
                                                PredictionPlanetId: { type: "integer" },
                                                planetlocation: { type: "string" },
                                                prediction: { type: "string" },
                                                predictionPlanet: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "integer" },
                                                        PlanetName: { type: "string" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": { description: "Prediction or planet not found" },
                    "401": { description: "Unauthorized - Admin auth required" },
                    "500": { description: "Server error" }
                }
            },
            delete: {
                summary: "Delete prediction",
                description: "Admin only - Delete a planet location prediction",
                tags: ["Admin - Planet Predictions"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "Prediction ID",
                        example: 123
                    }
                ],
                responses: {
                    "200": {
                        description: "Prediction deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Prediction deleted successfully" }
                                    }
                                }
                            }
                        }
                    },
                    "404": { description: "Prediction not found" },
                    "401": { description: "Unauthorized - Admin auth required" },
                    "500": { description: "Server error" }
                }
            }
        },
        "/api/admin/apikey": {
            post: {
                summary: "Create API key",
                description: "Admin only - Add a new API key to the system",
                tags: ["Admin - API Keys"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["apiKey"],
                                properties: {
                                    apiKey: {
                                        type: "string",
                                        example: "sk-1234567890abcdef",
                                        description: "The API key to store"
                                    }
                                }
                            }
                        }
                    }
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
                                        message: { type: "string", example: "Api key is Added" }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "API key required" },
                    "401": { description: "Unauthorized - Admin auth required" },
                    "500": { description: "Server error" }
                }
            },
            get: {
                summary: "Get API key",
                description: "Public - Retrieve API key by ID (returns masked version)",
                tags: ["Public - API Keys"],
                security: [],
                parameters: [
                    {
                        name: "apiKeyId",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        description: "API key ID",
                        example: "1"
                    }
                ],
                responses: {
                    "200": {
                        description: "API key retrieved (masked)",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        ApiKey: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "1" },
                                                key: {
                                                    type: "string",
                                                    example: "sk-12345...cdef",
                                                    description: "Masked API key (first 8 + ... + last 4 chars)"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "API key ID required" },
                    "404": { description: "API key not found" },
                    "500": { description: "Server error" }
                }
            },
            put: {
                summary: "Update API key",
                description: "Admin only - Update an existing API key",
                tags: ["Admin - API Keys"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["apiKey", "apikeyId"],
                                properties: {
                                    apiKey: {
                                        type: "string",
                                        example: "sk-newkey1234567890",
                                        description: "New API key value"
                                    },
                                    apikeyId: {
                                        type: "string",
                                        example: "1",
                                        description: "ID of the API key to update"
                                    }
                                }
                            }
                        }
                    }
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
                                        message: { type: "string", example: "Api key is Updated" }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "API key and ID required" },
                    "404": { description: "API key not found" },
                    "401": { description: "Unauthorized - Admin auth required" },
                    "500": { description: "Server error" }
                }
            }
        },
        "/api/auth/google-login": {
            post: {
                summary: "Google Login (1-click)",
                tags: ["Auth"],
                security: [],
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
                        description: "Login success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                                username: { type: "string" },
                                            }
                                        },
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "idToken is required" },
                    "401": { description: "Invalid Google account" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/auth/register": {
            post: {
                summary: "Register new user",
                tags: ["Auth"],
                security: [],
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
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                                username: { type: "string" },
                                                gender: { type: "string" },
                                                location: { type: "object" },
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    },
                    "409": { description: "Email or username taken" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/auth/login": {
            post: {
                summary: "Login with email and password",
                tags: ["Auth"],
                security: [],
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
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                            }
                                        },
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Email and password are required" },
                    "401": { description: "Invalid email or password" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/auth/refresh": {
            post: {
                summary: "Refresh access token",
                tags: ["Auth"],
                security: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" }
                                }
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Token refreshed",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        message: { type: "string" },
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Invalid or expired refresh token" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/admin/profile": {
            get: {
                summary: "Get admin profile",
                tags: ["Admin"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Admin profile",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        admin: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "404": { description: "Admin not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/admin/alluser": {
            get: {
                summary: "Get all users",
                tags: ["Admin"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: { type: "integer", default: 10 },
                    },
                    {
                        name: "search",
                        in: "query",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Users list",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                users: { type: "array", items: { type: "object" } },
                                                pagination: {
                                                    type: "object",
                                                    properties: {
                                                        total: { type: "number" },
                                                        page: { type: "number" },
                                                        limit: { type: "number" },
                                                        totalPages: { type: "number" },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/admin/user/{userId}": {
            get: {
                summary: "Get complete user data",
                tags: ["Admin"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "userId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Complete user data",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Invalid user ID" },
                    "404": { description: "User not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/admin/export": {
            post: {
                summary: "Export data to Excel",
                tags: ["Admin"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Excel file",
                        content: {
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                                schema: {
                                    type: "string",
                                    format: "binary",
                                },
                            },
                        },
                    },
                    "500": { description: "Export failed" },
                },
            },
        },
        "/api/auth/logout": {
            post: {
                summary: "Logout user",
                tags: ["Auth"],
                security: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" }
                                }
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Logged out successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                },
            },
        },
        "/api/profile": {
            get: {
                summary: "Get my profile",
                tags: ["Profile"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Profile retrieved",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string" },
                                        email: { type: "string" },
                                        username: { type: "string" },
                                        dateOfBirth: { type: "string", nullable: true },
                                        birthTime: { type: "string", nullable: true },
                                        gender: { type: "string", nullable: true },
                                        whatsappNumber: { type: "string", nullable: true },
                                        education: { type: "array", items: { type: "string" } },
                                        jobs: { type: "array", items: { type: "string" } },
                                        profileImage: { type: "string", nullable: true },
                                        birthLocation: { type: "string", nullable: true },
                                        latitude: { type: "number", nullable: true },
                                        longitude: { type: "number", nullable: true },
                                        reference: { type: "string", nullable: true },
                                        nickname: { type: "string", nullable: true },
                                        isProfileComplete: { type: "boolean" },
                                        profiles: { type: "array", items: { type: "object" } },
                                        mainUser: { type: "object", nullable: true },
                                    }
                                },
                            },
                        },
                    },
                    "404": { description: "User not found" },
                    "500": { description: "Server error" },
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
                                    jobs: { type: "array", items: { type: "string" } },
                                    education: { type: "array", items: { type: "string" } },
                                    profileImage: { type: "string", description: "Base64 encoded image" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Profile updated",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                                username: { type: "string" },
                                                dateOfBirth: { type: "string", nullable: true },
                                                birthTime: { type: "string", nullable: true },
                                                whatsappNumber: { type: "string", nullable: true },
                                                gender: { type: "string", nullable: true },
                                                jobs: { type: "array", items: { type: "string" } },
                                                education: { type: "array", items: { type: "string" } },
                                                birthLocation: { type: "string", nullable: true },
                                                latitude: { type: "number", nullable: true },
                                                longitude: { type: "number", nullable: true },
                                                profileImage: { type: "string", nullable: true },
                                                isProfileComplete: { type: "boolean" },
                                            }
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "404": { description: "User not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/profile/switch": {
            post: {
                summary: "Switch between profiles",
                tags: ["Profile"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["profileId"],
                                properties: {
                                    profileId: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Profile switched",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        token: { type: "string" },
                                        profileId: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Profile ID required" },
                    "403": { description: "Access denied" },
                    "404": { description: "Profile not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/addProfile": {
            post: {
                summary: "Add new sub-profile",
                tags: ["Profile"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "nickname"],
                                properties: {
                                    name: { type: "string" },
                                    nickname: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Profile created",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        profile: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                nickname: { type: "string" },
                                            }
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation error" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/jobs/options": {
            get: {
                summary: "Get job options",
                tags: ["Options"],
                responses: {
                    "200": {
                        description: "Job options",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    additionalProperties: {
                                        type: "array",
                                        items: { type: "string" }
                                    }
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/education/options": {
            get: {
                summary: "Get education options",
                tags: ["Options"],
                responses: {
                    "200": {
                        description: "Education options",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    additionalProperties: {
                                        type: "array",
                                        items: { type: "string" }
                                    }
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/planethouse": {
            post: {
                summary: "Generate planet house",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Planet house data",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        result: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/mahadasha": {
            post: {
                summary: "Generate Mahadasha",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Mahadasha data",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        result: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/anthardasha": {
            post: {
                summary: "Generate Anthar Dasha",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Anthar Dasha data",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        result: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/navam": {
            post: {
                summary: "Generate Navamsaka",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Navamsaka data",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        result: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/prediction/{planetName}": {
            post: {
                summary: "Generate planet prediction",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "planetName",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "Sun",
                    },
                ],
                responses: {
                    "200": {
                        description: "Prediction data",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        result: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/astrologic": {
            post: {
                summary: "Generate astrological details",
                tags: ["Horoscope"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Astrological details",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        result: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "500": { description: "Server error" },
                    "502": { description: "External API error" },
                },
            },
        },
        "/api/admin/google-login": {
            post: {
                summary: "Admin Google Login",
                tags: ["Admin"],
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["idToken"],
                                properties: {
                                    idToken: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Admin login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        admin: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                            },
                                        },
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "idToken required" },
                    "403": { description: "Not registered as admin" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/admin/refresh": {
            post: {
                summary: "Admin refresh token",
                tags: ["Admin"],
                security: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" }
                                }
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Token refreshed",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        message: { type: "string" },
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Invalid token" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/api/admin/logout": {
            post: {
                summary: "Admin logout",
                tags: ["Admin"],
                security: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" }
                                }
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Logged out successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Invalid token" },
                    "500": { description: "Server error" },
                },
            },
        },
    },
};
