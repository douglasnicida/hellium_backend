import { PrismaClient, User } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { LoginRequestBody, RegisterRequestBody } from "./auth.route";
import bcrypt from 'bcrypt';
import { FastifyInstance } from "fastify";
import { ConflictError, UnauthorizedError } from "../../handlers/errorHandler";
import { CustomReply } from "../../types/fastify.type";

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
        const user = await this.prisma.user.findFirst({where: {email: data.email}});

        if(user) {
            throw ConflictError('This e-mail is already registered.');
        }

        const newUserData = {
            ...data,
            password: await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS))
        }

        const newUser = await this.prisma.user.create({ data: newUserData });

        const resContent: CustomReply<User> = {
            message: 'User created successfully',
            payload: newUser,
        }

        return resContent;
    }

    async login(credentials: LoginRequestBody['Body'], fastifyApp: FastifyInstance) {
        const user = await this.prisma.user.findFirstOrThrow({
            where: {
                email: credentials.email,
            }
        })

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if(user && isValidPassword){
            const resContent: CustomReply<any> = {
                message: 'User logged in successfully.',
                payload: {
                    access_token: await this.generateToken(user.id, user.name, fastifyApp)
                }
            } 
            
            return resContent;
        }

        throw UnauthorizedError('Invalid credentials');
    }
}