import { MemberType } from "../libs/enums/member.enum";
import Errors, {HttpCode, Message } from "../libs/Errors";
import {LoginInput, Member, MemberInput} from "../libs/types/member"
import MemberModel from "../schema/Member.model";
import * as bcrypt from "bcryptjs"; // NEW: hashing and comparing passwords

class MemberService {
// OLD: private readonly memberModel;
private readonly memberModel: typeof MemberModel; // NEW: explicit type

constructor() {
    this.memberModel = MemberModel; 
}
public async processSignup(input: MemberInput): Promise<Member>  {
    const exist = await this.memberModel.findOne({memberType: MemberType.RESTAURANT})
    .exec();
    if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    console.log("before:", input.memberPassword);
    // NEW: hash the password before saving it
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    console.log("after:", input.memberPassword);

    try {
        const result = await this.memberModel.create(input);
        result.memberPassword = "";
        return result as unknown as Member;
    } catch(err) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
    }
 }
 public async processLogin(input: LoginInput): Promise<Member> {
   // OLD: const member = await this.memberModel
   // OLD: .findOne({memberNick: input.memberNick })
   // OLD: .exec();
   // NEW: "+memberPassword" adds the hidden password field for the Bcrypt check
   const member = await this.memberModel
   .findOne({ memberNick: input.memberNick }, { memberNick: 1, memberPassword: 1})
   .select("+memberPassword")
   .exec();

   // NEW: unknown nickname
   if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

   // NEW: compare the typed password with the stored hash
   const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
   console.log("isMatch:", isMatch);
   if(!isMatch) {
       throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
   }  


   // NEW: fetch the member again (without the password) and return it
   const result = await this.memberModel.findById(member._id).exec();
   if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

   // NEW: terminal output like the video, without _id
   const { _id, ...memberWithoutId } = result.toObject();
   console.log("member:", memberWithoutId);

   return result as unknown as Member;
 }
}

export default MemberService;