"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveNote(moduleId: string, contenu: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("notes").upsert(
    {
      user_id: user.id,
      module_id: moduleId,
      contenu,
      date_maj: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id" },
  );
  if (error) throw error;
}
