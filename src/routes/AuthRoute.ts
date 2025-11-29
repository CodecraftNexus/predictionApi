import { Router } from "express";
import { googleLogin, Login, logout, refreshToken, Register, setUsername } from "../controllers/authController";
import { validateRegister } from "../validators/register.validator";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register" , validateRegister , Register);
router.post("/login" , Login);
router.post("/refresh" , refreshToken);
router.post("/google-login" , googleLogin);
router.post("/set-username" , requireAuth , setUsername);
router.post("/logout", logout);

export default router;
