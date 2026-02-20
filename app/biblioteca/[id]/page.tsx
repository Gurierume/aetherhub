import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function FichaPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: ficha } = await supabase.from('decks').select('*').eq('id', id).single();

  async function salvarFicha(formData: FormData) {
    "use server";
    const nome = formData.get("nome");
    // Aqui estamos salvando apenas o nome por enquanto para testar a conexão
    await supabase.from('decks').update({ nome }).eq('id', id);
    revalidatePath(`/biblioteca/${id}`);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <Link href="/biblioteca" style={{ color: "#0070f3", textDecoration: "none" }}>← Voltar para Estante</Link>
      
      <form action={salvarFicha} style={{ backgroundColor: "white", padding: "2rem", borderRadius: "20px", marginTop: "1rem", border: "1px solid #eee" }}>
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", color: "#666", fontSize: "0.8rem" }}>Nome do Personagem:</label>
          <input 
            name="nome" 
            defaultValue={ficha?.nome} 
            style={{ width: "100%", fontSize: "2rem", fontWeight: "bold", border: "none", borderBottom: "2px solid #0070f3", outline: "none", padding: "5px 0" }} 
          />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <section>
            <h3 style={{ color: "#0070f3", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Atributos</h3>
            {["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"].map(attr => (
              <div key={attr} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <label>{attr}</label>
                <input type="number" defaultValue="10" style={{ width: "50px", textAlign: "center" }} />
              </div>
            ))}
          </section>

          <section>
            <h3 style={{ color: "#0070f3", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Detalhes</h3>
            <textarea placeholder="História do personagem..." style={{ width: "100%", height: "200px", marginTop: "10px", padding: "10px" }} />
          </section>
        </div>

        <button type="submit" style={{ marginTop: "2rem", width: "100%", padding: "15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
          💾 Salvar Alterações
        </button>
      </form>
    </div>
  );
}
