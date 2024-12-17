import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LoginPostSchema, RegisterPostSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { prisma } from "../../database/prisma-client";
import { CustomReply, HttpCodes } from "../../types/fastify.type";
import { User } from "@prisma/client";

export interface LoginRequestBody {
    Body: {
        email: string;
        password: string;
    }
}

export interface RegisterRequestBody {
    Body: {
        name: string;
    } & LoginRequestBody['Body'];
}

// TODO: testar rotas de autenticação
const authRoute = (fastifyApp: FastifyInstance, opts, done) => {
    const authService = new AuthService(prisma);

    fastifyApp.post('/register', RegisterPostSchema, async (req: FastifyRequest<RegisterRequestBody>, res: FastifyReply) => {
        
        const newUser = await authService.register(req.body);

        const resContent: CustomReply<User> = {
            message: 'User created successfully',
            payload: newUser,
        }

        return res.status(HttpCodes.CREATED).customSend(resContent);
    })

    fastifyApp.post('/login', LoginPostSchema,
    async (req: FastifyRequest<LoginRequestBody>, res: FastifyReply) => {

        const token = await authService.login(req.body, fastifyApp);

        const resContent: CustomReply<any> = {
            message: 'User logged in successfully.',
            payload: {
                access_token: token
            }
        }

        return res.status(HttpCodes.OK).customSend(resContent)
    })

    done();

}

export default authRoute;