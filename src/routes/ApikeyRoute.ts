import { Router } from 'express';
import { ApiKeyPost, getApiKey, putApikey ,  } from '../controllers/apiKeyController';

const  router =  Router();

router.post("/Apikey" , ApiKeyPost);
router.get("/Apikey" , getApiKey);
router.put("/Apikey", putApikey );

export default router;