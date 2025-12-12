import { Response } from "express"


export interface AuthToken{
    accessToken?:string,
    refreshToken?:string
}
export const setAuthCookie = (res:Response, tokenInfo:AuthToken) =>{
if(tokenInfo.accessToken ){
    res.cookie("accessToken", tokenInfo.accessToken, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000,
        secure: false,
      });
}

if(tokenInfo.refreshToken ){
    res.cookie("refreshToken", tokenInfo.refreshToken, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000,
        secure: false,
      });
}
}