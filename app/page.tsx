import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <h1>AetherHub</h1>
      <p>Gerencie seus decks de forma profissional.</p>

      <SignedOut>
        <SignInButton mode="modal">
          <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
            Entrar com Google
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <Link href="/biblioteca">
          <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>
            Acessar Minha Biblioteca
          </button>
        </Link>
      </SignedIn>
    </main>
  );
}
