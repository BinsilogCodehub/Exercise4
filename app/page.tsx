"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter your email address to continue.");
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
      setError("Use a valid Gmail address ending in @gmail.com.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    window.sessionStorage.setItem("notes-user", email.trim());
    setError("");
    router.push("/notes");
  }

  return (
    <main className="login-shell">
      <section className="login-story" aria-label="About Notelet">
        <Link className="brand brand-light" href="/" aria-label="Notelet home">
          <span className="brand-mark" aria-hidden="true">n</span>
          <span>notelet</span>
        </Link>
        <div className="story-copy">
          <p className="eyebrow">A quieter place to think</p>
          <h1>Make room for the thought.</h1>
          <p className="story-description">
            Catch the little things before they slip away. Your next good idea
            starts with a blank page.
          </p>
        </div>
        <div className="paper-preview" aria-hidden="true">
          <div className="paper-topline"><span>MONDAY, 9:41 AM</span><span>01 / 03</span></div>
          <p className="paper-title">A note to come back to</p>
          <div className="paper-rule" />
          <div className="paper-rule paper-rule-short" />
          <div className="paper-rule" />
          <div className="paper-rule paper-rule-medium" />
          <span className="paper-scribble">start anywhere</span>
        </div>
        <p className="story-footer">A small space for a busy mind.</p>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <p className="eyebrow login-eyebrow">WELCOME BACK</p>
          <h2>Pick up where you left off.</h2>
          <p className="form-intro">Sign in to open your notebook.</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error && (!email.trim() || !/^[^\s@]+@gmail\.com$/i.test(email.trim())))}
              aria-describedby={error ? "login-error" : undefined}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error && password.length < 8 && Boolean(email.trim()) && /^[^\s@]+@gmail\.com$/i.test(email.trim()))}
              aria-describedby={error ? "login-error" : undefined}
            />

            <button className="primary-button" type="submit">Open my notes <span aria-hidden="true">↗</span></button>
            <p className={`form-message${error ? " is-error" : ""}`} id="login-error" role="status" aria-live="polite">
              {error || "Use your Gmail address and a password of 8+ characters."}
            </p>
          </form>
        </div>
        <p className="login-bottom-note">No noise, just your notes.</p>
      </section>
    </main>
  );
}
