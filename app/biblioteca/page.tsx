import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function BibliotecaPage() {
  const user = await currentUser();
  if (!user) return <div style={{ padding: "2rem" }}>Verificando sessão...</div>;

  const { data: fichas } = await supabase
    .from('decks')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false });

  async function criarFicha() {
    "use server";
    const userAuth = await currentUser();
    if (!userAuth) return;
    await supabase.from('decks').insert([{ 
      nome: 'Nova Ficha de Herói', 
      usuario_id: userAuth.id,
      tema_id: 'base' 
    }]);
    revalidatePath('/biblioteca');
  }

  async function removerFicha(formData: FormData) {
    "use server";
    const id = formData.get("id");
    // Removendo apenas se o ID existir
    if (id) {
      await supabase.from('decks').delete().eq('id', id);
      revalidatePath('/biblioteca');
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
        <h1>Minha Estante de Fichas</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      
      <form action={criarFicha} style={{ marginTop: "2rem" }}>
        <button type="submit" style={{ padding: "12px 24px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          + Criar Nova Ficha
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
        {fichas?.map((ficha) => (
          <div key={ficha.id} style={{ padding: "1.5rem", border: "1px solid #ddd", borderRadius: "12px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <Link href={`/biblioteca/${ficha.id}`} style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold', fontSize: '1.2rem', display: 'block', marginBottom: '10px' }}>
              {ficha.nome}
            </Link>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
              <span style={{ fontSize: "0.7rem", color: "#999" }}>ID: {ficha.id.substring(0,8)}</span>
              
              <form action={removerFicha}>
                <input type="hidden" name="id" value={ficha.id} />
                <button 
                  type="submit" 
                  style={{ backgroundColor: "transparent", color: "#ff4d4f", border: "1px solid #ff4d4f", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
                  // Usamos o formAction com um pequeno truque de confirmação para evitar erro de tipo
                  formAction={async (formData) => {
                    "use server";
                    // Esta é uma alternativa segura para o build
                    await removerFicha(formData);
                  }}
                >
                  Remover
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
