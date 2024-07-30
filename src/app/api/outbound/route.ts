import { twilioClientGet } from "@/lib/thirdPartyClients/twilioClient";
import { NextRequest, NextResponse } from "next/server";

async function twilioHangup(
  callSid: string,
  accountSid?: string,
  authToken?: string
) {
  const { twilioClient, error } = twilioClientGet(accountSid, authToken);
  if (!twilioClient) return { error };

  try {
    const call = await twilioClient
      .calls(callSid!)
      .update({ twiml: "<Response><Hangup/></Response>" });
    return { call };
  } catch (error: any) {
    return { error: `Couldn't Hangup Twilio Call. Error: ${error.message}` };
  }
}

export async function GET() {
  return NextResponse.json({ message: "hello outbound" });
}

export async function POST() {
  try {
    const response = await fetch(`${process.env.VAPI_BASE_URL}/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      },
      body: JSON.stringify({
        phoneNumberId: "5fdbd730-2a4e-4d3b-a986-1941b62a77a6",
        assistantId: "4c555a00-3c92-46d4-80ec-60e5a67d036c",
        customer: {
          number: "+919138695195",
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
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

//temporary will be moved to hangup endpoint
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const callSid = body?.callSid ?? null;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const { call, error } = await twilioHangup(callSid, accountSid, authToken);
    if (error || !call) {
      throw Error(
        `Couldn't Hang Up Twilio Call. Error: ${JSON.stringify(error)}`
      );
    }
    return NextResponse.json(
      { message: "Succesfully hangup outbound call" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to hangup outbound call",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
