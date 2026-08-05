"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = null;

export default function LoginForm({ message }: { message?: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(
    login,
    initialState,
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signup,
    initialState,
  );

  const isSignup = mode === "signup";
  const action = isSignup ? signupAction : loginAction;
  const state = isSignup ? signupState : loginState;
  const pending = isSignup ? signupPending : loginPending;

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">
          {isSignup ? "Créer un compte" : "Connexion"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Consultant IA — parcours d&apos;apprentissage
        </p>
      </div>

      {message === "check-email" && (
        <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Vérifie ta boîte mail pour confirmer ton inscription.
        </p>
      )}

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "…" : isSignup ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(isSignup ? "login" : "signup")}
        className="text-sm text-zinc-500 underline underline-offset-2"
      >
        {isSignup ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
      </button>
    </div>
  );
}
