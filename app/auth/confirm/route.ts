import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OTP_TYPES = [
  "signup",
  "email_change",
  "email",
  "recovery",
  "invite",
  "magiclink",
] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = OTP_TYPES.find((t) => t === searchParams.get("type"));
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      redirect(next);
    }
  }

  redirect("/login?message=confirm-error");
}
