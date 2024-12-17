import { RegisterDTO } from "./registerDTO";

export interface LoginDTO extends Omit<RegisterDTO, 'name'>{}