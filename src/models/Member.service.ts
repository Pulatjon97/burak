import {Member, MemberInput} from "../libs/types/member"
import MemberModel from "../schema/Member.model";

class MemberService {
private readonly memberModel;

constructor() {
    this.memberModel = MemberModel; 
}
public async processSignup(input: MemberInput): Promise<Member>  {
const result = await this.memberModel.create(input);
result.memberPassword = "";
return result as unknown as Member;
 }
}

export default MemberService; 