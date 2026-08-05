import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Filet de sécurité en plus du proxy : chaque page protégée revérifie
  // l'utilisateur ici, comme recommandé par Supabase (ne jamais se fier
  // uniquement au middleware/proxy pour l'auth).
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-zinc-900">
            Consultant IA
          </Link>
          <Link href="/veille" className="text-sm text-zinc-500 hover:text-zinc-900">
            Veille
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
