declare module 'express' {
  import { IncomingMessage, ServerResponse } from 'http';
  import { Server } from 'http';

  export interface Request extends IncomingMessage {
    params: Record<string, string>;
    body?: any;
  }

  export interface Response extends ServerResponse {
    json: (body: any) => Response;
    status: (code: number) => Response;
  }

  export type NextFunction = () => void;
  export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

  export interface Express {
    use: (...handlers: any[]) => Express;
    get: (path: string, handler: RequestHandler) => Express;
    post: (path: string, handler: RequestHandler | ((req: Request, res: Response) => any)) => Express;
    listen: (port: number, cb?: () => void) => Server;
  }

  interface ExpressConstructor {
    (): Express;
    json: () => RequestHandler;
    static: (root: string) => RequestHandler;
  }

  const exp: ExpressConstructor;
  export default exp;
}
