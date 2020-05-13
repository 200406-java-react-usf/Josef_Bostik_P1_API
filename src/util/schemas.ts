import { Role } from '../models/role';

export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    role_name: Role
}

export interface ReimbursementSchema {
    id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    receipt: number; //placeholder
    author: number;
    resolver: string;
    reimb_status_id: number;
    reimb_type_id: number;
}
