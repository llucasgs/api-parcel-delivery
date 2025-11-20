import { Request, Response } from "express";
import { z } from "zod";

class UsersController {
  create = (request: Request, response: Response) => {
    const bodySchema = z.object({
      name: z.string({ required_error: "name is required!" }).trim().min(2),
      email: z.string({ required_error: "e-mail is required!" }).email(),
      password: z.string({ required_error: "password is required!" }).min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);
    return response.json({ message: "ok" });
  };
}

export { UsersController };
