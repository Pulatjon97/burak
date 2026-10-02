export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",

  // OLD: USED_NICK_PHONE = "You are inserting already used nick or phone",
  USED_NICK_PHONE = "You are inserting already used nick or phone!", // NEW: added "!" to match the course output
  NO_MEMBER_NICK = "No member with that nick!", // NEW
  WRONG_PASSWORD = "Wrong password, please try again!", // NEW
}

class Errors extends Error {
  public code: HttpCode;
  // OLD: public message: Message;
  public declare message: Message; // NEW: avoids the "overwrite base property" error
  static standart = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };
  constructor(statusCode: HttpCode, statusMessage: Message) {
    // OLD: super();
    // OLD: super(statusMessage); // NEW
    super(); // NEW: no argument, so the assignment below creates a visible property
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;