import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function BibliotecaPage() {
  const user = await currentUser();

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Cabeçalho com Nome e Botão de Perfil */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        borderBottom: "1px solid #eaeaea",
        paddingBottom: "1rem" 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>AetherHub</h1>
          <p style={{ color: "#666" }}>Bem-vindo de volta, <strong>{user?.firstName || user?.emailAddresses[0].emailAddress}</strong>!</p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>
      
      {/* Grade de Decks (Placeholder) */}
      <main style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Meus Decks</h2>
          <button style={{ 
            padding: "8px 16px", 
            backgroundColor: "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer" 
          }}>
            + Novo Deck
          </button>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
          gap: "1.5rem", 
          marginTop: "1.5rem" 
        }}>
          {/* Card de Exemplo */}
          <div style={{ padding: "1.5rem", border: "1px dashed #ccc", borderRadius: "8px", textAlign: "center" }}>
            <p style={{ color: "#999" }}>Você ainda não tem decks criados.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
