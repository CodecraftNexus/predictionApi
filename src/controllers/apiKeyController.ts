import { Request, Response } from "express";
import { db } from "../db";



export async function ApiKeyPost(req: Request, res: Response) {
    const { apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ success: false, message: "Api key required" });
    }

    try {
        await db.ApiKey.create(
            {
                key: apiKey,
            }
        );

        res.status(200).json({
            success: true,
            message: "Api key is Added"
        })

    } catch (error) {
        console.error("Add Api Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }


}


export async function getApiKey(req: Request, res: Response) {
    const { apiKeyId } = req.query;

    if (!apiKeyId) {
        return res.status(400).json({ success: false, message: "Api key id required" });
    }

    try {
        const ApiKey = await db.ApiKey.findByPk(apiKeyId as string);

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
    } catch (error) {
        console.error("Get Api Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


export async function putApikey(req: Request, res: Response) {
    const { apiKey, apikeyId } = req.body
    if (!apiKey || !apikeyId) {
        return res.status(400).json({ success: false, message: "Api key and Api key id are required" });
    }

    try {
        const findApiKey = await db.ApiKey.findByPk(apikeyId);
        await findApiKey?.update({ key: apiKey })

        return res.status(400).json({ success: false, message: "Api key is Updated" });
    } catch (error) {
        console.error("Update Api Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }

}