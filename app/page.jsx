import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
      <h1>Event Platform</h1>
      <p>Fans discover and attend events. Artists create and manage them.</p>
      <p>
        <Link href="/login">Log in</Link> &nbsp;|&nbsp; <Link href="/register">Register</Link>
      </p>
    </main>
  );
}
