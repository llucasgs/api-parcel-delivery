import { Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcrypt";

class UsersController {
  create = async (request: Request, response: Response) => {
    const bodySchema = z.object({
      name: z.string({ required_error: "name is required!" }).trim().min(2),
      email: z.string({ required_error: "e-mail is required!" }).email(),
      password: z.string({ required_error: "password is required!" }).min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const hashedPassword = await hash(password, 8); // Criptografa a senha.
    return response.json({ message: "ok", hashedPassword });
  };
}

export { UsersController };
