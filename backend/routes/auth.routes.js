import { Router } from "express";
import {
    signup_get,
    signup_post,
    login_get,
    login_post
} from '../controllers/auth.controller.js'
const router = Router()

router.get("/signup", signup_get);
router.get("/login", login_get);

router.post("/signup", signup_post);

router.post("/login", login_post);


export default router