import { ObjectId } from "mongodb";

export class CreateSaleDTO {
  amount: number;
  status: string;
  items: ObjectId[];
  customer: ObjectId;
}