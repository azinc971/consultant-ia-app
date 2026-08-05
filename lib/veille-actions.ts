"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addVeilleEntry(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const titre = String(formData.get("titre") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const resume = String(formData.get("resume") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  if (!titre) throw new Error("Le titre est requis");

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await supabase.from("veille").insert({
    user_id: user.id,
    titre,
    url: url || null,
    resume: resume || null,
    tags,
  });
  if (error) throw error;

  revalidatePath("/veille");
}
