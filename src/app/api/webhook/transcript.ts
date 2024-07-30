import { db } from "@/lib/dbFunctions/callDbFunctions";
import { BaseVapiPayload, VapiWebhookEnum } from "./route";

export interface TranscriptMessageResponse {}
export interface TranscriptPayload extends BaseVapiPayload {
  type: VapiWebhookEnum.TRANSCRIPT;
  role: "assistant" | "user";
  transcriptType: "partial" | "final";
  transcript: string;
}

export const transcriptHandler = async (
  payload?: TranscriptPayload
): Promise<TranscriptMessageResponse> => {
  /**
   * Handle Business logic here.
   * Sent during a call whenever the transcript is available for certain chunk in the stream.
   * You can store the transcript in your database or have some other business logic.
   */
  const { call, ...rest } = payload!;
  const callId = call?.phoneCallProviderId;
  if (rest.transcriptType !== "final") return {};

  if (callId && !db?.[callId]) {
    db[callId] = {
      transcript: [rest],
    };
  }
  if (callId && db?.[callId]) {
    const prev = db[callId];
    const prevTranscript = (prev?.transcript ?? []) as Array<unknown>;
    db[callId] = {
      ...prev,
      transcript: [...prevTranscript, rest],
    };
  }
  // console.log({ db: JSON.stringify(db) });

  return {};
};
