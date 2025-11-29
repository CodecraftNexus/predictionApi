import Express from "express";
import { sequelize } from "./db/sequelize";

import { openApiSpec } from "./docs/openapi";
import { corsOrigins, env } from "./config/env";

import "./db";
import AuthRoute from "./routes/AuthRoute";
import profileRoute from "./routes/profileRoute"
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cors from "cors";
import ApikeyRoute from "./routes/ApikeyRoute";
import cookieParser from "cookie-parser";

const app = Express();

app.use(Express.json({ limit: "10mb" }));
app.use(Express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());

if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


app.use(
  helmet({
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
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    errors: ["Rate limit exceeded"],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

app.use(
  cors({
    origin: corsOrigins as string[],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


try {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
        requestInterceptor: (req: any) => {
          req.credentials = "include";
          return req;
        },
      },
    })
  );

  console.log(`📋 Swagger UI Ready → ${env.base_Url}/api/docs`);
} catch (err) {
  console.warn("swagger-ui-express not installed → npm i swagger-ui-express");
}
app.use("/api/auth", AuthRoute);
app.use("/api", profileRoute);
app.use("/api" ,ApikeyRoute)


async function StartServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    if (env.NODE_ENV === "production") {
      console.log(
        "⚠️ Production mode: Please run migrations manually using 'npm run migrate"
      );
    } else {
      console.log("🔄️ Development mode: Syncing database models...");
      if (env.FORCE_SYNC === true) {
        console.log(
          "💡 FORCE_SYNC is enabled: All tables will be dropped and recreated. Data loss may occur!"
        );
      } else {
        console.log(
          "💡 Tip: Set FORCE_SYNC=true in .env to recreate tables if needed"
        );
      }

      await sequelize.sync({
        force: env.FORCE_SYNC === true,
        alter: false,
        logging: false,
      });

      console.log("✅ Database models synchronized.");
    }

    app.listen(env.PORT, () => {
      console.log(`👍 Server runing on port ${env.PORT}`);
      console.log(`🌐 Server Url ${env.base_Url}`);
      console.log("Server Working healthy ✅");
    });
  } catch (error) {
    console.error("❌ Unable to start server :", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  try {
    await sequelize.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...");
  try {
    await sequelize.close();
    console.log("✅ Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

StartServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
