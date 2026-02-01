import dotenv from "dotenv";

dotenv.config();

export interface ConfigType {
    port: number,
    db_url: string,
    jwtKey: string,
    expreDay: string,
    frontendUrl: string,
    refreshKey : string
}

export const config: ConfigType = {
    port: Number(process.env.PORT) || 5500,
    db_url: String(process.env.DB_URL),
    jwtKey: String(process.env.JWT_SECRET) || "akdlfjdklahfkajsfhfuihfqewhirf",
    refreshKey: String(process.env.REFRESH_SECRET_KEY) || "akdlfjdklahfkajsfhfuihfqewhirf",
    expreDay: String(process.env.EXPIRE_DAY) || "5d",
    frontendUrl: String(process.env.FRONTEND_URL)
}