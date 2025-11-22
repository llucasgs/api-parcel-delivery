// Aqui vamos extender a tipagem do Express e adicionar coisas novas no Request
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}
