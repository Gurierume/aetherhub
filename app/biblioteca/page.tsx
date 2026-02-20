import { UserButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Cliente Supabase com proteção para variáveis ausentes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function BibliotecaPage() {
  const user = await currentUser();

  // Se o usuário não for encontrado, o middleware deve redirecionar, 
  // mas deixamos este aviso por segurança extra.
  if (!user) {
    return <div style={{ padding: "2rem" }}>Verificando sua sessão...</div>;
  }

  // Busca as fichas com tratamento de erro
  const { data: fichas, error } = await supabase
    .from('decks')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false });

  async function criarFicha() {
    "use server";
    const userAuth = await currentUser();
    if (!userAuth) return;

    await supabase
      .from('decks')
      .insert([{ 
        nome: 'Nova Ficha Estratégica', 
        usuario_id: userAuth.id,
        tema_id: 'base' 
      }]);
    
    revalidatePath('/biblioteca');
  }

  async function removerFicha(id: string) {
    "use server";
    const userAuth = await currentUser();
    if (!userAuth) return;

    await supabase
      .from('decks')
      .delete()
      .eq('id', id)
      .eq('usuario_id', userAuth.id);
    
    revalidatePath('/biblioteca');
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "1rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>AetherHub</h1>
          <p style={{ color: "#666" }}>Bem-vindo, <strong>{user.firstName || "Explorador"}</strong></p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <SignOutButton redirectUrl="/">
            <button style={{ padding: "8px 12px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px" }}>Sair</button>
          </SignOutButton>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2>Minhas Fichas</h2>
          <form action={criarFicha}>
            <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              + Nova Ficha
            </button>
          </form>
        </div>

        {error && <p style={{ color: 'red' }}>Erro ao carregar fichas. Verifique suas chaves no painel da Vercel.</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {fichas && fichas.map((ficha) => (
            <div key={ficha.id} style={{ padding: "1.5rem", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff", position: "relative" }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{ficha.nome}</h3>
              <p style={{ fontSize: "0.8rem", color: "#888" }}>Tema: {ficha.tema_id}</p>
              
              <form action={removerFicha.bind(null, ficha.id)} onSubmit={(e) => !confirm("Apagar?") && e.preventDefault()}>
                <button type="submit" style={{ marginTop: "10px", color: "#ff4d4f", background: "none", border: "1px solid #ffccc7", borderRadius: "4px", cursor: "pointer", width: "100%" }}>
                  🗑️ Remover
                </button>
              </form>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
