import { Request, Response, NextFunction } from "express";
function asyncTryCatchMiddleware(
  handler: (req: Request, res: Response) => Promise<any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}

export default asyncTryCatchMiddleware;
