import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { db } from "../db";
import { env } from "../config/env";
import parseDuration from "../utils/parseDuratin";
import { clearAuthCookies, setAuthCookies } from "../utils/cookie.helper";
import { OAuth2Client } from "google-auth-library";
import { AuthRequest } from "../middleware/auth";

// ======================== IsDev ===========================
const isDev = env.NODE_ENV !== "production";
// ======================== REGISTER ========================
export async function Register(req: Request, res: Response) {
    const { fullName, email, password, username} = req.body;

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedUsername = username?.toLowerCase().trim();

        const existing = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: normalizedEmail }, { username: normalizedUsername },
                ],
            },
        });

        if (existing) {
            return res.status(409).json({ success: false, message: "User already exists with this email or username" });
        }

        const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

        const newUser = await db.User.create({
            name: fullName.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            hashPassword: hashedPassword,
            genderId: "1",
            birth_location_id: "1",
        });

        const [gender, location] = await Promise.all([
            db.Gender.findByPk(newUser.genderId),
            db.BirthLocation.findByPk(newUser.birth_location_id),
        ]);

        return res.status(201).json({
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                gender: gender?.type,
                location: location,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

// ======================== LOGIN ========================
export async function Login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await db.User.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!user || !user.hashPassword || !(await bcrypt.compare(password, user.hashPassword))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            env.JWT_SECRET as string,
            {
                expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as string,
            } as jwt.SignOptions
        );

        const refreshPlain = crypto.randomBytes(64).toString("hex");
        const refreshHash = crypto.createHash("sha256").update(refreshPlain).digest("hex");
        const expiresAt = new Date(Date.now() + parseDuration(env.REFRESH_TOKEN_EXPIRES_IN!));

        await db.RefreshToken.create({
            userId: user.id,
            tokenHash: refreshHash,
            expiresAt,
            revoked: false,
        });

        if (!isDev) { setAuthCookies(res, accessToken, refreshPlain) };

        const payload: any = {
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };

        if (isDev) {
            payload.access_token = accessToken;
            payload.refresh_token = refreshPlain;
        }

        return res.json(payload);
        
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

// ======================== REFRESH TOKEN ========================
export async function refreshToken(req: Request, res: Response) {
    const incomingRefreshToken = isDev ? req.body.refreshToken : req.cookies?.refresh_token;
    if (!incomingRefreshToken) {
        return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const tokenHash = crypto.createHash("sha256").update(incomingRefreshToken).digest("hex");

    try {
        const existing = await db.RefreshToken.findOne({
            where: {
                tokenHash,
                revoked: false,
                expiresAt: { [Op.gt]: new Date() },
            },
        });

        if (!existing) {
            return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
        }

        // Revoke old token (rotation)
        await db.RefreshToken.destroy({ where: { id: existing.id } });

        // Create new refresh token
        const newPlain = crypto.randomBytes(64).toString("hex");
        const newHash = crypto.createHash("sha256").update(newPlain).digest("hex");
        const newExpiresAt = new Date(Date.now() + parseDuration(env.REFRESH_TOKEN_EXPIRES_IN!));

        await db.RefreshToken.create({
            userId: existing.userId,
            tokenHash: newHash,
            expiresAt: newExpiresAt,
            revoked: false,
        });

        // New access token
        const newAccessToken = jwt.sign(
            { userId: existing.userId },
            env.JWT_SECRET as string,
            {
                expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as string,
            } as jwt.SignOptions
        );

        if (!isDev) {
            setAuthCookies(res, newAccessToken, newPlain);
        }

        const payload: any = {
            success: true,
            message: "Token refreshed successfully",
        };

        if (isDev) {
            payload.access_token = newAccessToken;
            payload.refresh_token = newPlain;
        }
        return res.json(payload);
    } catch (error) {
        console.error("refreshToken error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

// ======================== Login With Google ==============================
export async function googleLogin(req: Request, res: Response) {
    const googleClient = new OAuth2Client();
    try {
        const { idToken } = req.body;
        if (!idToken || typeof idToken !== "string") {
            return res.status(400).json({ success: false, message: "idToken is required" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload?.sub || !payload.email || !payload.email_verified) {
            return res.status(401).json({ success: false, message: "Invalid Google account" });
        }
        const { sub: googleId, email, name } = payload;

        // Find existing user by email
        let user = await db.User.findOne({ where: { email } });
        let isNewUser = false;

        if (!user) {
            // Create new user without username
            user = await db.User.create({
                email: email,
                name: name ?? email.split("@")[0],
                genderId: "1",
                birth_location_id: "1"
                // Don't set username here - let user choose it
            });
            isNewUser = true;
        }

        // Handle OAuth account
        const existingOAuth = await db.OAuthAccount.findOne({ 
            where: { provider: "google", providerId: googleId } 
        });
        
        if (existingOAuth) {
            existingOAuth.metadata = payload;
            await existingOAuth.save();
        } else {
            await db.OAuthAccount.create({ 
                userId: user.id, 
                provider: "google", 
                providerId: googleId, 
                metadata: payload 
            });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user.id },
            env.JWT_SECRET as string,
            {
                expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as string,
            } as jwt.SignOptions
        );

        const refreshPlain = crypto.randomBytes(64).toString("hex");
        const refreshHash = crypto.createHash("sha256").update(refreshPlain).digest("hex");
        const expiresAt = new Date(Date.now() + parseDuration(env.REFRESH_TOKEN_EXPIRES_IN!));

        await db.RefreshToken.create({
            userId: user.id,
            tokenHash: refreshHash,
            expiresAt,
            revoked: false,
        });

        // Set cookies in production
        if (!isDev) { 
            setAuthCookies(res, accessToken, refreshPlain);
        }

        // Prepare response
        const responseJson: any = {
            success: true,
            message: "Login successful",
            requiresUsername: isNewUser || user?.username,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username || null, // Include username if exists
            },
        };

        // Include tokens in development mode
        if (isDev) {
            responseJson.access_token = accessToken;
            responseJson.refresh_token = refreshPlain;
        }

        return res.json(responseJson);

    } catch (err: any) {
        console.error("Google Login Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


export async function setUsername(req: AuthRequest, res: Response) {
    try {
        const { username } = req.body;

        if (!/^[a-zA-Z0-9](?!.*[._-]{2})[a-zA-Z0-9._-]*[a-zA-Z0-9]$/.test(username) || username.length < 3 || username.length > 20) {
            return res.status(400).json({ success: false, message: "Invalid username format" });
        }

        const existing = await db.User.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        const userId = req.user!.userId;

        const user = await db.User.findByPk(userId);
        await user?.update({ username });

        return res.json({
            success: true,
            user: { ...user?.toJSON(), username },
        });
    } catch (error) {
        console.error("Username set Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}




// ======================== LOGOUT (Current Device) ========================
export async function logout(req: Request, res: Response) {
    const token = isDev ? req.body.refreshToken : req.cookies?.refresh_token;
    if (!token) {
        if (!isDev) {
            clearAuthCookies(res);
        }

        return res.json({ success: true, message: "Already logged out" });
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await db.RefreshToken.destroy({ where: { tokenHash: hash } });

    if (!isDev) {
        clearAuthCookies(res);
    }


    return res.json({ success: true, message: "Logged out successfully" });
}