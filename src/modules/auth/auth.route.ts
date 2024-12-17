import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
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
        
        try {
            const resContent = await authService.register(req.body);

            return res.status(HttpCodes.CREATED).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    fastifyApp.post('/login', LoginPostSchema,
    async (req: FastifyRequest<LoginRequestBody>, res: FastifyReply) => {

        try {
            const resContent = await authService.login(req.body, fastifyApp);
        
            return res.status(HttpCodes.OK).customSend(resContent)
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    done();

}

export default authRoute;