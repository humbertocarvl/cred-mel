import { Request, Response } from 'express';
export declare const getParticipants: (req: Request, res: Response) => Promise<void>;
export declare const createParticipant: (req: Request, res: Response) => Promise<void>;
export declare const updateParticipant: (req: Request, res: Response) => Promise<void>;
export declare const bulkCreateParticipants: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=ParticipantController.d.ts.map