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
  NO_MEMBER_NICK = "No member with that nick!", // NEW
  WRONG_PASSWORD = "Wrong password, please try again!", // NEW
}

class Errors extends Error {
  public code: HttpCode;
  // OLD: public message: Message;
  public declare message: Message; // NEW: avoids the "overwrite base property" error

  constructor(statusCode: HttpCode, statusMessage: Message) {
    // OLD: super();
    super(statusMessage); // NEW
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;