import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LoginPostSchema, RegisterPostSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { prisma } from "../../database/prisma-client";
import { CustomReply, HttpCodes } from "../../types/fastify.type";
import { LoginDTO } from "./dto/loginDTO";
import { RegisterDTO } from "./dto/registerDTO";
import { User } from "@prisma/client";

export interface LoginRequestBody {
    Body: LoginDTO
}

export interface RegisterRequestBody {
    Body: RegisterDTO
}

const authRoute = (fastifyApp: FastifyInstance, opts, done) => {
    const authService = new AuthService(prisma);

    fastifyApp.post('/register', RegisterPostSchema, 
    async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const body = req.body as RegisterRequestBody['Body'];
            const newUser = await authService.register(body);

            const resContent: CustomReply<User> = {
                message: 'User created successfully',
                payload: newUser,
            }

            return res.status(HttpCodes.CREATED).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    fastifyApp.post('/login', LoginPostSchema,
    async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const body = req.body as LoginRequestBody['Body'];
            const access_token_obj = await authService.login(body, fastifyApp);

            const resContent: CustomReply<{access_token: string}> = {
                message: 'User logged in successfully.',
                payload: access_token_obj
            } 
        
            return res.status(HttpCodes.OK).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    done();

}

export default authRoute;