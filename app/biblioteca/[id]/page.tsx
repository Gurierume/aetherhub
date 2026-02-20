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

  async function salvarTudo(formData: FormData) {
    "use server";
    const updates = {
      nome: formData.get("nome"),
      força: parseInt(formData.get("Força") as string),
      destreza: parseInt(formData.get("Destreza") as string),
      constituição: parseInt(formData.get("Constituição") as string),
      inteligência: parseInt(formData.get("Inteligência") as string),
      sabedoria: parseInt(formData.get("Sabedoria") as string),
      carisma: parseInt(formData.get("Carisma") as string),
      historia: formData.get("historia")
    };

    await supabase.from('decks').update(updates).eq('id', id);
    revalidatePath(`/biblioteca/${id}`);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <Link href="/biblioteca" style={{ color: "#0070f3", textDecoration: "none" }}>← Voltar para Estante</Link>
      
      <form action={salvarTudo} style={{ backgroundColor: "white", padding: "2rem", borderRadius: "20px", marginTop: "1rem", border: "1px solid #eee", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        <input name="nome" defaultValue={ficha?.nome} style={{ width: "100%", fontSize: "2rem", fontWeight: "bold", border: "none", borderBottom: "2px solid #0070f3", outline: "none", marginBottom: "2rem" }} />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <section>
            <h3 style={{ color: "#0070f3" }}>Atributos</h3>
            {["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"].map(attr => (
              <div key={attr} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f9f9f9" }}>
                <label>{attr}</label>
                <input name={attr} type="number" defaultValue={ficha?.[attr.toLowerCase()] || 10} style={{ width: "60px", textAlign: "center", borderRadius: "4px", border: "1px solid #ddd" }} />
              </div>
            ))}
          </section>

          <section>
            <h3 style={{ color: "#0070f3" }}>Sua Jornada</h3>
            <textarea name="historia" defaultValue={ficha?.historia} placeholder="Conte a história do seu herói..." style={{ width: "100%", height: "250px", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", resize: "none" }} />
          </section>
        </div>

        <button type="submit" style={{ marginTop: "2rem", width: "100%", padding: "15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>
          💾 Salvar Alterações
        </button>
      </form>
    </div>
  );
}
