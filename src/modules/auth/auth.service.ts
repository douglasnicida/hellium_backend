import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { LoginRequestBody, RegisterRequestBody } from "./auth.route";
import bcrypt from 'bcrypt';
import { FastifyInstance } from "fastify";

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    
    private async generateToken(userID: string, username: string, fastifyApp: FastifyInstance) {
        const tokenPayload = {id: userID, name: username}
        
        const access_token = fastifyApp.jwt.sign(tokenPayload, {expiresIn: '10000h'});

        return access_token;
    }

    async validateToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch(err) {
            return null;
        }
    }

    async register(data: RegisterRequestBody['Body']) {

        const newUserData = {
            ...data,
            password: await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS))
        }

        const newUser = await this.prisma.user.create({ data: newUserData });

        return newUser;
    }

    async login(credentials: LoginRequestBody['Body'], fastifyApp: FastifyInstance) {
        const user = await this.prisma.user.findFirstOrThrow({
            where: {
                email: credentials.email,
            }
        })

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if(user && isValidPassword){
            return this.generateToken(user.id, user.name, fastifyApp);
        }

        throw new Error('Invalid credentials');
    }
}