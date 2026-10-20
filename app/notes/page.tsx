"use client";

import { startTransition, type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export default function NotesPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [search, setSearch] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const signedInEmail = window.sessionStorage.getItem("notes-user");
    if (!signedInEmail) {
      router.replace("/");
      return;
    }

    let savedNotes: Note[] = [];
    try {
      const storedNotes = window.localStorage.getItem(`notelet:${signedInEmail}`);
      savedNotes = storedNotes ? (JSON.parse(storedNotes) as Note[]) : [];
    } catch {
      savedNotes = [];
    }
    startTransition(() => {
      setEmail(signedInEmail);
      setNotes(savedNotes);
      setIsReady(true);
    });
  }, [router]);

  useEffect(() => {
    if (isReady && email) {
      window.localStorage.setItem(`notelet:${email}`, JSON.stringify(notes));
    }
  }, [email, isReady, notes]);

  function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody) return;

    const note: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled note",
      body: trimmedBody,
      createdAt: new Date().toLocaleString("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    setNotes((currentNotes) => [note, ...currentNotes]);
    setTitle("");
    setBody("");
  }

  function handleLogout() {
    window.sessionStorage.removeItem("notes-user");
    router.replace("/");
  }

  const normalizedSearch = search.trim().toLowerCase();
  const visibleNotes = notes.filter((note) =>
    `${note.title} ${note.body}`.toLowerCase().includes(normalizedSearch),
  );

  if (!isReady || !email) {
    return <main className="loading-state">Opening your notebook…</main>;
  }

  return (
    <main className="notes-shell">
      <header className="notes-topbar">
        <a className="brand brand-dark" href="/notes" aria-label="Notelet notes">
          <span className="brand-mark" aria-hidden="true">n</span>
          <span>notelet</span>
        </a>
        <div className="topbar-actions">
          <span className="user-email">{email}</span>
          <button className="logout-button" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <section className="notes-main">
        <div className="notes-heading">
          <div>
            <p className="eyebrow">YOUR NOTEBOOK</p>
            <h1>A place for your thoughts.</h1>
          </div>
          <span className="notes-count">{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
        </div>

        <form className="composer" onSubmit={handleCreateNote}>
          <input
            aria-label="Note title"
            placeholder="Give this note a title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            aria-label="Note text"
            placeholder="What’s on your mind?"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
          />
          <div className="composer-footer">
            <span className="composer-hint">Only you can see what you save here.</span>
            <button className="add-button" type="submit">Add note <span aria-hidden="true">＋</span></button>
          </div>
        </form>

        <div className="notes-heading notes-list-heading">
          <h2 className="eyebrow">RECENT NOTES</h2>
          {notes.length > 0 && (
            <label className="search-control">
              <span className="sr-only">Search notes</span>
              <input
                type="search"
                placeholder="Search notes"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          )}
        </div>

        <div className="notes-list">
          {visibleNotes.map((note) => (
            <article className="note-card" key={note.id}>
              <div className="note-card-header">
                <div>
                  <h2>{note.title}</h2>
                  <time>{note.createdAt}</time>
                </div>
                <button
                  className="delete-button"
                  type="button"
                  aria-label={`Delete ${note.title}`}
                  title="Delete note"
                  onClick={() => setNotes((currentNotes) => currentNotes.filter((item) => item.id !== note.id))}
                >
                  ×
                </button>
              </div>
              <p>{note.body}</p>
            </article>
          ))}
          {visibleNotes.length === 0 && (
            <div className="empty-state">
              <p>{notes.length ? "No notes match that search." : "Your notebook is ready for its first thought."}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}