import { NextRequest, NextResponse } from "next/server";
import {
  endOfCallReportHandler,
  EndOfCallReportPayload,
} from "./endOfCallReport";
import { statusUpdateHandler, StatusUpdatePayload } from "./statusUpdate";
import { transcriptHandler, TranscriptPayload } from "./transcript";

export enum VapiWebhookEnum {
  STATUS_UPDATE = "status-update",
  END_OF_CALL_REPORT = "end-of-call-report",
  HANG = "hang",
  SPEECH_UPDATE = "speech-update",
  TRANSCRIPT = "transcript",
}

export interface VapiCall {
  phoneCallProviderId: string | undefined;
}
export interface BaseVapiPayload {
  call: VapiCall;
}
export type VapiPayload =
  | StatusUpdatePayload
  | EndOfCallReportPayload
  | TranscriptPayload;

export interface ConversationMessage {
  role: "user" | "system" | "bot" | "function_call" | "function_result";
  message?: string;
  name?: string;
  args?: string;
  result?: string;
  time: number;
  endTime?: number;
  secondsFromStart: number;
}

export async function GET() {
  return NextResponse.json({ message: "hello webhook" });
}

export async function POST(request: NextRequest) {
  const conversationUuid = request.nextUrl.searchParams.get(
    "conversation_uuid"
  ) as string;
  if (conversationUuid) {
    // This way we can fetch some data from database and use it in the handlers.
    // Here you can fetch some context which will be shared accorss all the webhook events for this conversation.
    console.log("conversationUuid", conversationUuid);
  }
  try {
    const payload = (await request.json()).message as VapiPayload;
    // console.log("type", payload.type, payload);
    switch (payload.type) {
      case VapiWebhookEnum.STATUS_UPDATE:
        return NextResponse.json(await statusUpdateHandler(payload), {
          status: 201,
        });
      case VapiWebhookEnum.END_OF_CALL_REPORT:
        return NextResponse.json(await endOfCallReportHandler(payload), {
          status: 201,
        });
      case VapiWebhookEnum.TRANSCRIPT:
        return NextResponse.json(await transcriptHandler(payload), {
          status: 201,
        });
      default:
        throw new Error(`Unhandled message type`);
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to place outbound call",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
