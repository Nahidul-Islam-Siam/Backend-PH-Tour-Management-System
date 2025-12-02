import { Router } from "express";
import { AuthController } from "./auth.controller";



const router = Router()

router.post("/login", AuthController.credintialsLogin)

export const AuthRoutes = router