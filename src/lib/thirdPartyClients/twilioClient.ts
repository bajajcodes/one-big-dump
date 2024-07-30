import { Twilio } from "twilio";

// const twilioClient = new Twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

export function twilioClientGet(accountSid?: string, authToken?: string) {
  try {
    const twilioClient = new Twilio(accountSid, authToken);
    return { twilioClient };
  } catch (error: any) {
    return {
      error: `Couldn't Instantiate Twilio Client. Error: ${JSON.stringify(
        error.message
      )}`,
    };
  }
}
