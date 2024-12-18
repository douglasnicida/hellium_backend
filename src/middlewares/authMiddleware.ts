import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { AuthService } from "../modules/auth/auth.service";
import { prisma } from "../database/prisma-client";
import { HttpCodes } from "../types/fastify.type";

declare module 'fastify' {
    interface FastifyRequest {
        user: any;
    }
}

const handleAuthenticate = async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
    const authService = new AuthService(prisma);
    
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token) {
        return res.status(401).send({
            status: HttpCodes.UNAUTHORIZED,
            message: 'Token is required'
        })
    }

    // Validating token if it was passed in the requisition header
    const decoded = await authService.validateToken(token);
    if(!decoded) {
        return res.status(401).send({
            status: HttpCodes.UNAUTHORIZED,
            message: 'Invalid token'
        })
    }

    // Adding token payload into req.user
    req.user = decoded;
}

export default handleAuthenticate;