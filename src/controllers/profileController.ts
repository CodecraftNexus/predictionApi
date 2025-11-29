import { Response } from "express";
import { db } from '../db';
import { AuthRequest } from "src/middleware/auth";
import { updateProfileSchema } from "../validators/updateProfile.validator";

export async function getProfile(req: AuthRequest, res: Response) {
  try {


    const UserId = req.user!.userId;
    const User = db.User
    const user = await User.findByPk(UserId)

    const [gender, location] = await Promise.all([
      db.Gender.findByPk(user?.genderId),
      db.BirthLocation.findByPk(user?.birth_location_id),
    ]);




    const payload: any = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      username: user?.username,
      dateOfBirth: user?.dateOfBirth,
      birthTime: user?.birthTime,
      gender: gender?.type,
      whatsappNumber: user?.WhatsappNumber,
    }


    if (location && String(location.id) !== "1") {
      payload.birthLocation = location.name;
      payload.latitude = location.latitude;
      payload.longitude = location.longitude;
    }


    const isProfileComplete =
      gender?.type &&
      user?.dateOfBirth &&
      user?.birthTime &&
      location?.name &&
      location?.latitude &&
      location?.longitude;

      if(!isProfileComplete){
        payload.isProfileComplete = false;

      }else {
        payload.isProfileComplete = true;
      }
    return res.json(payload);
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


export async function UpdateProfile(req: AuthRequest, res: Response) {
  try {
    // 1. Validate input
    const parsed = updateProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        parsed.error.issues.map((issue) => [issue.path[0], issue.message])
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const {
      dateOfBirth,
      birthTime,
      latitude,
      longitude,
      birthLocation,
      gender: genderType,
      whatsappNumber,
    } = parsed.data;

    const userId = req.user!.userId;

    // 2. Find user with current associations
    const user = await db.User.findByPk(userId, {
      include: [
        { model: db.BirthLocation, as: "birthLocation" },
        { model: db.Gender, as: "gender" },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updates: any = {};

    // Simple fields
    if (dateOfBirth !== undefined && dateOfBirth !== "") {
      updates.dateOfBirth = dateOfBirth;
    }
    if (birthTime !== undefined && birthTime !== "") {
      updates.birthTime = birthTime;
    }
    if (whatsappNumber !== undefined) {
      updates.WhatsappNumber = whatsappNumber || null;
    }

    // Gender handling
    if (genderType !== undefined && genderType !== "") {
      if (["Male", "Female", "Other"].includes(genderType)) {
        const [gender] = await db.Gender.findOrCreate({
          where: { type: genderType },
          defaults: { type: genderType },
        });
        updates.genderId = gender.id;
      } else {
        updates.genderId = null;
      }
    }

    // Birth Location handling (create or reuse existing)
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      birthLocation !== undefined
    ) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      const name = birthLocation.trim();


      if (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180 &&
        name !== ""
      ) {

        let location = await db.BirthLocation.findOne({
          where: {
            name: name,
            latitude: lat,
            longitude: lng,
          },
        });
        if (!location) {
          location = await db.BirthLocation.create({
            name: name,
            latitude: lat,
            longitude: lng,
          });
        }

        updates.birth_location_id = location.id;
      }

      else if (name === "" && (latitude !== undefined || longitude !== undefined)) {
        updates.birth_location_id = null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.json({
        success: true,
        message: "No changes detected",
        user,
      });
    }

    await user.update(updates);

    await user.reload({
      include: [
        { model: db.BirthLocation, as: "birthLocation" },
        { model: db.Gender, as: "gender" },
      ],
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        birthTime: user.birthTime,
        whatsappNumber: user.WhatsappNumber,
        gender: user.gender?.type || null,
        birthLocation: user.birthLocation
          ? {
            id: user.birthLocation.id,
            name: user.birthLocation.name,
            latitude: user.birthLocation.latitude,
            longitude: user.birthLocation.longitude,
          }
          : null,
      },
    });
  } catch (error: any) {
    console.error("UpdateProfile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}