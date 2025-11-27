// Aqui vamos extender a tipagem do Express e adicionar coisas novas no Request
declare namespace Express {
  export interface User {
    id: string;
    role: "sale" | "customer";
  }

  export interface Request {
    user?: User;
  }
}
