/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express'
import { UserRoutes } from './app/modules/user/user.route';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorhandler';
import httpStatus from 'http-status-codes';
import notFound from './app/middlewares/notFound';
import { AuthRoutes } from './app/modules/auth/auth.route';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/user", UserRoutes)
app.use("/api/v1/auth", AuthRoutes)


app.use(cors());

app.get("/",(req:Request, res: Response) =>{
    res.status(200).json({
        message:"Welcome to Tour Management System Backend"
    })
})


app.use(globalErrorHandler)

app.use(notFound);

export default app