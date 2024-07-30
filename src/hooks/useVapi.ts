"use client";

import { useState } from "react";

export enum CALL_STATUS {
  INACTIVE = "inactive",
  ACTIVE = "active",
  LOADING = "loading",
}

export interface BaseMessage {
  type: MessageTypeEnum;
}

export type Message = TranscriptMessage;

export enum MessageTypeEnum {
  TRANSCRIPT = "transcript",
}

export enum MessageRoleEnum {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

export enum TranscriptMessageTypeEnum {
  PARTIAL = "partial",
  FINAL = "final",
}

export interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT;
  role: MessageRoleEnum;
  transcriptType: TranscriptMessageTypeEnum;
  transcript: string;
}

export function useVapi() {
  const [callId, setCallId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(
    CALL_STATUS.INACTIVE
  );

  const [messages, setMessages] = useState<Message[]>([]);

  const [activeTranscript, setActiveTranscript] =
    useState<TranscriptMessage | null>(null);

  const start = async () => {
    setCallStatus(CALL_STATUS.LOADING);
    const response = await fetch("/api/outbound", {
      method: "POST",
    });
    const call = await response.json();
    const callId = call.phoneCallProviderId;
    console.log({ call, callId });
    setCallId(callId);
  };

  const stop = async () => {
    setCallStatus(CALL_STATUS.LOADING);
    const response = await fetch("/api/outbound", {
      method: "DELETE",
      body: JSON.stringify({ callSid: callId }),
    });
    const data = await response.json();
    console.log({ data });
  };

  const toggleCall = () => {
    if (callStatus == CALL_STATUS.ACTIVE) {
      stop();
    } else {
      start();
    }
  };

  return {
    callId,
    start,
    stop,
    toggleCall,
    callStatus,
    messages,
    activeTranscript,
  };
}
