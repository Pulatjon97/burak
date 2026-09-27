import mongoose, {Schema} from 'mongoose';
import { MemberType } from "../libs/enums/member.enum";



const memberSchema = new Schema({
  memberType: {
    type: String,
    enum: MemberType
  }
});