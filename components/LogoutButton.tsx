import { logout } from "@/lib/auth/actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm text-zinc-500 underline underline-offset-2"
      >
        Se déconnecter
      </button>
    </form>
  );
}
