import { auth, currentUser } from "@clerk/nextjs/server";
import apiErrorResponse from "../_lib/apiErrorResponse";
import apiSuccessResponse from "../_lib/apiSuccessResponse";

export async function GET() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = auth();

  if (!userId) {
    return apiErrorResponse({ message: "Unauthorized", status: 401 });
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();
  if (!user) return apiErrorResponse({ message: "Unauthorized", status: 401 });

  // Perform your Route Handler's logic with the returned user object
  return apiSuccessResponse({
    data: user,
    message: "Successfully got user.",
  });
}
