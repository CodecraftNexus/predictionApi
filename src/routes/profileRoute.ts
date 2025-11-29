import {Router } from "express";
import {requireAuth } from "../middleware/auth";
import { getProfile, UpdateProfile } from "../controllers/profileController";
import { AntharDasha, Mahadasha, PlanetHouse } from "../controllers/PlanetHouseController";
import { sunPrediction } from "../controllers/predictionController";


const router = Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, UpdateProfile);
router.post('/planethouse', requireAuth, PlanetHouse);
router.post("/mahadasha",requireAuth , Mahadasha);
router.post("/anthardasha", requireAuth , AntharDasha);
router.get("/test" ,  requireAuth, sunPrediction)

export default router;