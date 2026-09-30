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
    // REMOVED: console.log("Existing RESTAURANT member:", exist);  (TEMP DEBUG)
    if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    // NEW: hash the password before saving it to the database
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
        const result = await this.memberModel.create(input);
        result.memberPassword = "";
        return result as unknown as Member;
    } catch(err) {
        // REMOVED: console.log("Signup real error:", err);  (TEMP DEBUG)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
    }
 }
 public async processLogin(input: LoginInput): Promise<Member> {
   // OLD: const member = await this.memberModel
   // OLD: .findOne({memberNick: input.memberNick })
   // OLD: .exec();
   // NEW: memberPassword has select:false in the schema, so it must be requested explicitly
   const member = await this.memberModel
   .findOne(
     { memberNick: input.memberNick },
     {_id: 0, memberNick: 1, memberPassword: 1 }
   )
   .exec();

   // OLD: console.log("member:", member);
   // OLD: return member;

   // REMOVED: console.log("All nicks in DB:", ...)  (TEMP DEBUG)

   // NEW: unknown nickname
   if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

   // NEW: compare the typed password with the stored hash
   const isMatch = await bcrypt.compare(
     input.memberPassword,
     member.memberPassword
   );
   if (!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

   // NEW: fetch the member again (without the password) and return it
   const result = await this.memberModel.findById(member._id).exec();
   console.log("member:", result); // NEW: same output as in the video, without the password
   return result as unknown as Member;
 }
}

export default MemberService;