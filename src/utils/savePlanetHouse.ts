import { db } from "../db";

const planetFirstLetterMap: Record<string, string> = {
    "රවි": "ර",
    "චන්ද්‍ර": "ච",
    "කුජ": "කු",
    "බුධ": "බු",
    "ගුරු": "ගු",
    "ශුක්‍ර": "ශු",
    "ශනි": "ශ",
    "රාහු": "රා",
    "කේතු": "කේ",
    "ලගුරු": "ගු",
    "ලග්නය": ""
};

export const savePlanetHouseFromApi = async (userId: number, apiResponse: any) => {
    const houses = apiResponse.response;

    if (!houses || !houses["1"]) {
        throw new Error("Invalid API response structure");
    }

    const lagnayaZodiac = houses["1"].zodiac;

    const boxData: Record<string, string> = {};

    for (let i = 1; i <= 12; i++) {
        const houseKey = i.toString();
        const house = houses[houseKey];

        if (!house) {
            boxData[`box${i}`] = "";
            continue;
        }

        const planetsInHouse = house.planets
            .filter((p: string) => p !== "ලග්නය")
            .map((p: string) => planetFirstLetterMap[p] || "")
            .filter(Boolean)
            .join(","); 

        boxData[`box${i}`] = planetsInHouse;
    }

    const planetHouseData = {
        userId: String(userId),
        lagnaya: lagnayaZodiac,
        box1: boxData.box1 || null,
        box2: boxData.box2 || null,
        box3: boxData.box3 || null,
        box4: boxData.box4 || null,
        box5: boxData.box5 || null,
        box6: boxData.box6 || null,
        box7: boxData.box7 || null,
        box8: boxData.box8 || null,
        box9: boxData.box9 || null,
        box10: boxData.box10 || null,
        box11: boxData.box11 || null,
        box12: boxData.box12 || null,
    };

const [planetHouse, created] = await db.PalentHouse.findOrCreate({
  where: { userId: String(userId) },
  defaults: {
    ...planetHouseData
  }
});

if (!created) {
  await planetHouse.update(planetHouseData);
}

    const savedRecord = await db.PalentHouse.findOne({
        where: { userId: String(userId) },
    });

    if (!savedRecord) {
        throw new Error("Failed to retrieve saved planet house data");
    }


    const formatBox = (value: string | null): string[] => {
        if (!value) return [];
        return value.split(",").filter(Boolean); 
    };

    const responseData = {
        lagnaya: savedRecord.lagnaya,
        box1: formatBox(savedRecord.box1 || ""),
        box2: formatBox(savedRecord.box2 || ""),
        box3: formatBox(savedRecord.box3 || ""),
        box4: formatBox(savedRecord.box4 || ""),
        box5: formatBox(savedRecord.box5 || ""),
        box6: formatBox(savedRecord.box6 || ""),
        box7: formatBox(savedRecord.box7 || ""),
        box8: formatBox(savedRecord.box8 || ""),
        box9: formatBox(savedRecord.box9 || ""),
        box10: formatBox(savedRecord.box10 || ""),
        box11: formatBox(savedRecord.box11 || ""),
        box12: formatBox(savedRecord.box12 || ""),
    };

    return {
        success: true,
        data: responseData,
        message: "Planet house data saved and retrieved successfully",
    };
};