import { env } from "../config/env";
import parseDuration from "./parseDuratin";
import { Response } from "express";
const isProd = env.NODE_ENV === "production";
export const setAuthCookies = (res: Response, accessToken: string, refreshTokenPlain: string) => {

    const accessTtlSec = parseDuration(env.ACCESS_TOKEN_EXPIRES_IN!);
    const refreshTtlSec = parseDuration(env.REFRESH_TOKEN_EXPIRES_IN!);

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: !isProd,
        sameSite: !isProd ? "none" : "lax" as const, 
        path: "/",
        maxAge: accessTtlSec,
    });

    res.cookie("refresh_token", refreshTokenPlain, {
        httpOnly: true,
        secure: !isProd,
        sameSite: !isProd ? "none" : "lax" as const, 
        path: "/api/auth/refresh",
        maxAge: refreshTtlSec,
    });

    if (!isProd) {
        res.setHeader("X-Access-Token", accessToken);
        res.setHeader("X-Refresh-Token", refreshTokenPlain);
    }
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/api/auth/refresh" });

    if (!isProd) {
        res.removeHeader("X-Access-Token");
        res.removeHeader("X-Refresh-Token");
    }
};