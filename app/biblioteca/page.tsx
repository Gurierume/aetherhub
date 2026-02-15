import { UserButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Configuração do Banco de Dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BibliotecaPage() {
  const user = await currentUser();

  // Função para salvar um deck no Supabase
  async function criarDeck() {
    "use server";
    
    const { error } = await supabase
      .from('decks')
      .insert([
        { 
          nome: 'Novo Deck Estratégico', 
          usuario_id: user?.id 
        }
      ]);

    if (!error) {
      revalidatePath('/biblioteca');
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "1rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>AetherHub</h1>
          <p style={{ color: "#666" }}>Bem-vindo, <strong>{user?.firstName || "Explorador"}</strong></p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <SignOutButton redirectUrl="/">
            <button style={{ padding: "8px 12px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px" }}>Sair da Conta</button>
          </SignOutButton>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Meus Decks</h2>
          <form action={criarDeck}>
            <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              + Novo Deck
            </button>
          </form>
        </div>

        <div style={{ marginTop: "1.5rem", padding: "2rem", border: "1px dashed #ccc", borderRadius: "8px", textAlign: "center" }}>
          <p>Clique no botão acima para testar o banco de dados.</p>
        </div>
      </main>
    </div>
  );
}
