import { BaseVapiPayload, ConversationMessage, VapiWebhookEnum } from "./route";

export interface EndOfCallReportPayload extends BaseVapiPayload {
  type: VapiWebhookEnum.END_OF_CALL_REPORT;
  endedReason: string;
  transcript: string;
  messages: ConversationMessage[];
  summary: string;
  recordingUrl?: string;
}

export const endOfCallReportHandler = async (
  payload?: EndOfCallReportPayload
): Promise<void> => {
  /**
   * Handle Business logic here.
   * You can store the information like summary, typescript, recordingUrl or even the full messages list in the database.
   */

  return;
};
