import { NextResponse } from "next/server";

export default function apiSuccessResponse({
  data,
  message = "Successfully fetched data.",
  status = 200,
}: {
  data: string | number | boolean | object | symbol | bigint;
  message?: string;
  status?: number;
}) {
  return NextResponse.json({ data, success: true, message }, { status });
}
