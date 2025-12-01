declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
        }
    }
}
import { Request, Response, NextFunction } from 'express';
export declare function authenticateJWT(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map