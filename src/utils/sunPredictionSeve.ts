import { db } from "../db";

export const saveSunPredictionFromApi = async (userId: number, apiResponse: any) => {
    const predictions = apiResponse.response;

    if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
        throw new Error("Invalid planet prediction API response structure");
    }

    const recordsToSave: any[] = predictions.map((pred: any) => ({
        userId: String(userId),
        general_prediction: pred.general_prediction,
        personalised_prediction: pred.personalised_prediction,
        planet_zodiac_prediction: pred.planet_zodiac_prediction,
        verbal_location: pred.verbal_location,
    }));

    for (const record of recordsToSave) {
        const [predRecord, created] = await db.sunPrediction.findOrCreate({
            where: {
                userId: record.userId,
                verbal_location: record.verbal_location,
            },
            defaults: record,
        });

        if (!created) {
            await predRecord.update(record);
        }
    }
const savedPredictions = await db.sunPrediction.findAll({
        where: { userId: String(userId) },
        attributes: ['general_prediction', 'personalised_prediction', 'planet_zodiac_prediction', 'verbal_location'],
    });

    const formattedData = savedPredictions.map(pred => ({
        general_prediction: pred.general_prediction,
        personalised_prediction: pred.personalised_prediction,
        planet_zodiac_prediction: pred.planet_zodiac_prediction,
        verbal_location: pred.verbal_location,
    }));

    return {
        success: true,
        data: {
            total_predictions_saved: recordsToSave.length,
            predictions: formattedData,
        },
        message: "sun prediction data saved successfully",
    };
};