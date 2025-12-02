// src/app/modules/user/user.route.ts
import { Router } from "express";
import { UserController } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateReqest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

router.get(
  "/all-users",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),

  UserController.getAllUsers
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserController.UpdateUser
);

// api/v1/user/:id

export const UserRoutes = router;
