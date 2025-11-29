import moment from 'moment';
import {db} from '../db'; 

interface AstrologyParamsResult {
    params: URLSearchParams;
    userId: number;
    paramsPredictionSun : URLSearchParams;
}

export async function getAstrologyApiParams(userIdFromToken: string | number) :Promise<AstrologyParamsResult>{

   const userId = Number(userIdFromToken);
          if (isNaN(userId)) {
              throw { status: 400, message: 'Invalid user id' };
          }

    const user = await db.User.findByPk(userId, {
        include: [
            { model: db.Gender, as: 'gender', attributes: ['type'] },
            { model: db.BirthLocation, as: 'birthLocation', attributes: ['name', 'latitude', 'longitude'] }
        ]
    });

    if (!user || !user.gender || !user.birthLocation) {
        throw { status: 400, message: 'Profile data missing' };
    }

    const isProfileComplete =
        user.gender.type &&
        user.dateOfBirth &&
        user.birthTime &&
        user.birthLocation.name &&
        user.birthLocation.latitude != null &&
        user.birthLocation.longitude != null;

    if (!isProfileComplete) {
        throw { status: 400, message: 'Update your Profile' };
    }

    const formattedDate = moment(user.dateOfBirth).format('DD/MM/YYYY');
    const formattedTime = user.birthTime?.substring(0, 5) ?? '';

    const apiKeyRecord = await db.ApiKey.findByPk('1');

    if (!apiKeyRecord?.key) {
        throw { status: 500, message: 'API key not configured' };
    }

    const params = new URLSearchParams({
        api_key: apiKeyRecord.key,
        dob: formattedDate,
        tob: formattedTime,
        lat: String(user.birthLocation.latitude!),
        lon: String(user.birthLocation.longitude!),
        tz: '5.5',
        lang: 'si',
    });



     const paramsPredictionSun = new URLSearchParams({
        api_key: apiKeyRecord.key,
        dob: formattedDate,
        tob: formattedTime,
        lat: String(user.birthLocation.latitude!),
        lon: String(user.birthLocation.longitude!),
        tz: '5.5',
        lang: 'si',
        planet: "Sun",
    });


    return { params, userId , paramsPredictionSun };
}