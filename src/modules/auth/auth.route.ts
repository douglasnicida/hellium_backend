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
    async (req: FastifyRequest<RegisterRequestBody>, res: FastifyReply) => {
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