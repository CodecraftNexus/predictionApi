import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { savePlanetHouseFromApi } from "../utils/savePlanetHouse";
import { env } from "../config/env";
import { getAstrologyApiParams } from "../utils/astrologyParams";
import { saveDashaFromApi } from "../utils/mahadashaSeve";
import { saveAntardashaFromApi } from "../utils/anthardashaSeve";


export async function PlanetHouse(req: AuthRequest, res: Response) {
    try {

        const { params, userId } = await getAstrologyApiParams(req.user!.userId || "");
        const apiUrl = `${env.planetHouseApiUrl}?${params}`;

        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Horoscope/1.0'
            }
        });


        if (!response.ok) {
            const text = await response.text();
            console.error("API Error Response:", text);
            return res.status(502).json({
                success: false,
                message: "External API error",
                status: response.status,
                statusText: response.statusText,
                body: text.substring(0, 500)
            });
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
            return res.status(502).json({ success: false, message: "Invalid response format from API" });
        }

        if (data.success === false) {
            return res.status(502).json({
                success: false,
                message: "API returned error",
                apiError: data.message || data.error || "Unknown error from API"
            });
        }

        if (!data || !data.response) {
            console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
            return res.status(502).json({
                success: false,
                message: "Unexpected response structure",
                received: data
            });
        }

        const result = await savePlanetHouseFromApi(userId, data);

        return res.json({
            success: true,
            message: "Horoscope generated and saved successfully",
            result
        });

    } catch (error) {
        console.error('Error in /planetHouse route:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}


export async function Mahadasha(req: AuthRequest, res: Response) {

     try {

        const { params, userId } = await getAstrologyApiParams(req.user!.userId || "");
        const apiUrl = `${env.mahadashaApiUrl}?${params}`;

        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Horoscope/1.0'
            }
        });


        if (!response.ok) {
            const text = await response.text();
            console.error("API Error Response:", text);
            return res.status(502).json({
                success: false,
                message: "External API error",
                status: response.status,
                statusText: response.statusText,
                body: text.substring(0, 500)
            });
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
            return res.status(502).json({ success: false, message: "Invalid response format from API" });
        }

        if (data.success === false) {
            return res.status(502).json({
                success: false,
                message: "API returned error",
                apiError: data.message || data.error || "Unknown error from API"
            });
        }

        if (!data || !data.response) {
            console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
            return res.status(502).json({
                success: false,
                message: "Unexpected response structure",
                received: data
            });
        }

        const result = await saveDashaFromApi(userId, data);

        return res.json({
            success: true,
            message: "Horoscope generated and saved successfully",
            result
        });

    } catch (error) {
        console.error('Error in /mahadasha route:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }   
}


export async function AntharDasha(req: AuthRequest, res: Response) {
    try {

        const { params, userId } = await getAstrologyApiParams(req.user!.userId || "");
        const apiUrl = `${env.antharDashaApiUrl}?${params}`;

        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Horoscope/1.0'
            }
        });


        if (!response.ok) {
            const text = await response.text();
            console.error("API Error Response:", text);
            return res.status(502).json({
                success: false,
                message: "External API error",
                status: response.status,
                statusText: response.statusText,
                body: text.substring(0, 500)
            });
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
            return res.status(502).json({ success: false, message: "Invalid response format from API" });
        }

        if (data.success === false) {
            return res.status(502).json({
                success: false,
                message: "API returned error",
                apiError: data.message || data.error || "Unknown error from API"
            });
        }

        if (!data || !data.response) {
            console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
            return res.status(502).json({
                success: false,
                message: "Unexpected response structure",
                received: data
            });
        }

        const result = await saveAntardashaFromApi(userId, data);

        return res.json({
            success: true,
            message: "Anthar Dasha generated and saved successfully",
            result
        });

    } catch (error) {
        console.error('Error in /anthardhasha route:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}


