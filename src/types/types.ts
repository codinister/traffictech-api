import { RowDataPacket } from "mysql2";

export interface UserType extends RowDataPacket {
  user_id: number;
  firstname: string; 
  lastname: string; 
  email: string; 
  phone: string; 
  password: string;
}