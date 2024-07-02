import { NextResponse } from "next/server";

export default function apiErrorResponse(options?: {
  message?: string;
  status?: number;
}) {
  return NextResponse.json(
    {
      success: false,
      message: options?.message || "Failed while fetching data.",
    },
    { status: options?.status || 500 }
  );
}
