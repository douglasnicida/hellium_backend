import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LoginPostSchema, RegisterPostSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { prisma } from "../../database/prisma-client";
import { HttpCodes } from "../../types/fastify.type";
import { LoginDTO } from "./dto/loginDTO";
import { RegisterDTO } from "./dto/registerDTO";

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
            const resContent = await authService.register(body);

            return res.status(HttpCodes.CREATED).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    fastifyApp.post('/login', LoginPostSchema,
    async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const body = req.body as LoginRequestBody['Body'];
            const resContent = await authService.login(body, fastifyApp);
        
            return res.status(HttpCodes.OK).customSend(resContent)
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    done();

}

export default authRoute;