import React, { useState, useMemo } from "react";

// ── Dados da Proposta (Mock baseado na análise da planilha) ───────────────
const ESTATISTICAS_FASES = {
  1: { qtd: 120, valor: 27898.81, desc: "Substituição Imediata (>15 anos)" },
  2: { qtd: 273, valor: 49707.57, desc: "Substituição Programada (10 a 15 anos)" },
  3: { qtd: 226, valor: 387707.08, desc: "Manutenção/Manter (<10 anos)" }
};

const RESUMO_CATEGORIAS_FASE1 = [
  { cat: "Ar Condicionado", qtd: 40, idadeMedia: 19.1, valor: 11928.14 },
  { cat: "Condicionamento de Energia", qtd: 33, idadeMedia: 19.3, valor: 13019.81 },
  { cat: "Refrigeração", qtd: 32, idadeMedia: 19.9, valor: 2150.85 },
  { cat: "Bebedouro", qtd: 12, idadeMedia: 19.5, valor: 459.47 },
  { cat: "Eletrodomésticos", qtd: 2, idadeMedia: 17.0, valor: 167.80 },
  { cat: "Outros", qtd: 1, idadeMedia: 25.0, valor: 172.74 },
];

const MOCK_EQUIPAMENTOS = [
  { id: 1, tombo: 123, categoria: "Condicionamento de Energia", descricao: "ESTABILIZADOR DE VOLTAGEM DE 1.0 KVA", lotacao: "NJUD - MEMÓRIA DOCUMENTAL", aquisicao: "1995-12-01", idade: 31, valorBaixa: 15.99, fase: 1 },
  { id: 2, tombo: 2808, categoria: "Refrigeração", descricao: "REFRIGERADOR TIPO RESIDENCIAL SIMPLES COR BRANCA", lotacao: "ADM C. MIRIM - COPA", aquisicao: "1995-07-17", idade: 31, valorBaixa: 45.00, fase: 1 },
  { id: 3, tombo: 1090, categoria: "Refrigeração", descricao: "REFRIGERADOR TIPO FRIGOBAR", lotacao: "TR - ASSESSORIA DA 1ª RELATORIA", aquisicao: "2000-08-07", idade: 26, valorBaixa: 42.51, fase: 1 },
  { id: 4, tombo: 1213, categoria: "Outros", descricao: "COMPRESSOR DE AR", lotacao: "NIP - SALA DE MANUTENÇÃO", aquisicao: "2001-01-12", idade: 25, valorBaixa: 172.74, fase: 1 },
  { id: 5, tombo: 4872, categoria: "Bebedouro", descricao: "BEBEDOURO DE AGUA TIPO GARRAFAO NA COR BRANCA", lotacao: "3ª VARA - SECRETARIA DE VARA", aquisicao: "2002-09-10", idade: 24, valorBaixa: 35.00, fase: 1 },
  { id: 6, tombo: 5147, categoria: "Ar Condicionado", descricao: "CONDICIONADOR DE AR DE TETO TIPO SPLIT 12000 BTUS", lotacao: "NJUD - SEÇÃO DE CENTRAL DE ATENDIMENTO", aquisicao: "2003-03-17", idade: 23, valorBaixa: 120.00, fase: 1 },
  { id: 7, tombo: 8540, categoria: "Ar Condicionado", descricao: "CONDICIONADOR DE AR SPLIT 24000 BTUS", lotacao: "5ª VARA - GABINETE", aquisicao: "2012-05-10", idade: 14, valorBaixa: 250.00, fase: 2 },
  { id: 8, tombo: 9102, categoria: "Eletrodomésticos", descricao: "CAFETEIRA ELÉTRICA PROGRAMÁVEL", lotacao: "COPA CENTRAL", aquisicao: "2013-11-20", idade: 13, valorBaixa: 80.00, fase: 2 },
  { id: 9, tombo: 11055, categoria: "Ar Condicionado", descricao: "AR CONDICIONADO INVERTER 12000 BTUS", lotacao: "GABINETE JUIZ SUBSTITUTO", aquisicao: "2020-02-15", idade: 6, valorBaixa: 1500.00, fase: 3 },
  { id: 10, tombo: 12500, categoria: "Refrigeração", descricao: "GELADEIRA FROST FREE 451L INVERTER", lotacao: "REFEITÓRIO", aquisicao: "2022-08-01", idade: 4, valorBaixa: 2800.00, fase: 3 }
];

// ── Constantes & Utils ────────────────────────────────────────────────────
const FASES_CONFIG = {
  1: { label: "Curto Prazo (Imediato)", bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", icon: "🚨" },
  2: { label: "Médio Prazo (Prog.)", bg: "#fef3c7", color: "#b45309", border: "#fcd34d", icon: "⚠️" },
  3: { label: "Longo Prazo (Manter)", bg: "#dcfce7", color: "#16a34a", border: "#86efac", icon: "✅" },
};

const CATEGORIAS_ICONES = {
  "Ar Condicionado": "❄️",
  "Refrigeração": "🧊",
  "Bebedouro": "💧",
  "Condicionamento de Energia": "⚡",
  "Eletrodomésticos": "☕",
  "Outros": "⚙️"
};

const brl = n => Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const strPad = (num) => String(num).padStart(5, '0');

function BadgeFase({ fase }) {
  const s = FASES_CONFIG[fase];
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>{s.icon} {s.label}</span>;
}

// ── Componentes de Visão ──────────────────────────────────────────────────
function PainelVisaoGeral({ setAba }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: -.5 }}>Plano de Eficiência Energética</div>
        <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Mapeamento e cronograma de substituição patrimonial focado na redução de consumo.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[1, 2, 3].map(f => {
          const stats = ESTATISTICAS_FASES[f];
          const conf = FASES_CONFIG[f];
          return (
            <div key={f} style={{ background: "#fff", border: `2px solid ${f === 1 ? conf.border : "#e2e8f0"}`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
              {f === 1 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: conf.color }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: conf.color, textTransform: "uppercase", letterSpacing: .5 }}>Fase {f}</div>
                <div style={{ fontSize: 24 }}>{conf.icon}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4, lineHeight: 1.2 }}>{stats.desc}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Equipamentos identificados na triagem.</div>
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>QUANTIDADE</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{stats.qtd} <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>itens</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>BAIXA CONTÁBIL</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>R$ {brl(stats.valor)}</div>
                </div>
              </div>
              {f === 1 && (
                <button onClick={() => setAba("fase1")} style={{ width: "100%", marginTop: 16, background: conf.bg, color: conf.color, border: `1px solid ${conf.border}`, borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                  Detalhar Plano de Ação →
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 16, background: "#0ea5e9", borderRadius: 2 }}></div> Justificativa Técnica Geral
        </div>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0, textAlign: "justify" }}>
          O principal vetor para o alto consumo de energia em instalações prediais está atrelado à obsolescência tecnológica dos equipamentos de climatização e refrigeração. Equipamentos com mais de 10 anos de fabricação operam com compressores de baixa eficiência (sem tecnologia Inverter) e fluidos refrigerantes defasados. O cronograma foi estruturado com base na idade patrimonial, priorizando (Fase 1) 120 passivos tecnológicos críticos, como estabilizadores antigos e aparelhos de janela/splits com mais de 15 anos, para sanar imediatamente a cobrança por eficiência.
        </p>
      </div>
    </div>
  );
}

function PainelFase1() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <BadgeFase fase={1} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>Substituição Imediata</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: -.5 }}>Ação Imediata (120 equipamentos)</div>
        </div>
        <button style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          📥 Exportar Relação de Baixa (XLSX)
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {RESUMO_CATEGORIAS_FASE1.map((cat, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: "#f1f5f9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {CATEGORIAS_ICONES[cat.cat] || "📦"}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{cat.cat}</div>
                <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>Idade Média: {cat.idadeMedia} anos</div>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", borderRadius: 8, padding: "10px 14px", border: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>A SUBSTITUIR</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{cat.qtd} <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>itens</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>IMPACTO CONTÁBIL</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>R$ {brl(cat.valor)}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 12, lineHeight: 1.4 }}>
              {cat.cat === "Ar Condicionado" && "Substituição mandatória por modelos Inverter (Selo Procel A). Maior ofensor da matriz energética atual."}
              {cat.cat === "Condicionamento de Energia" && "Estabilizadores antigos causam dissipação térmica severa. Substituir por Nobreaks ou filtros de linha profissionais."}
              {cat.cat === "Refrigeração" && "Compressores defasados e desgaste de isolamento térmico. Recomenda-se consolidação predial de frigobares."}
              {cat.cat === "Bebedouro" && "Modelos de garrafão antigos (alguns com mais de 24 anos) com termostatos defeituosos."}
              {cat.cat === "Eletrodomésticos" && "Cafeteiras industriais com resistências ineficientes operando além da vida útil projetada."}
              {cat.cat === "Outros" && "Máquinas e ferramentas de manutenção (Compressores) com alto desgaste mecânico."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PainelInventario() {
  const [busca, setBusca] = useState("");
  const [filtroFase, setFiltroFase] = useState("todos");
  const [detalhe, setDetalhe] = useState(null);

  const filtrados = MOCK_EQUIPAMENTOS.filter(eq => {
    if (filtroFase !== "todos" && eq.fase !== parseInt(filtroFase)) return false;
    if (busca && !eq.descricao.toLowerCase().includes(busca.toLowerCase()) && !String(eq.tombo).includes(busca)) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: -.5 }}>Inventário Analítico</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Base de 619 equipamentos de impacto energético triados da planilha original.</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input 
          placeholder="Buscar por tombo ou descrição..." 
          value={busca} 
          onChange={e => setBusca(e.target.value)} 
          style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", fontSize: 13, width: 280, background: "#fff", outline: "none" }} 
        />
        <select value={filtroFase} onChange={e => setFiltroFase(e.target.value)} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", fontSize: 13, background: "#fff", cursor: "pointer", color: "#475569" }}>
          <option value="todos">Todas as Fases</option>
          <option value="1">Fase 1 (Ação Imediata)</option>
          <option value="2">Fase 2 (Ação Programada)</option>
          <option value="3">Fase 3 (Manter)</option>
        </select>
        <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#64748b" }}>
          Exibindo {filtrados.length} itens (amostra demonstrativa)
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Tombo", "Categoria", "Descrição", "Lotação", "Idade", "Valor Atualizado", "Prioridade"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: .5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((eq, i) => (
              <tr key={eq.id} onClick={() => setDetalhe(eq)} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.15s" }} onMouseEnter={ev => ev.currentTarget.style.background = "#f0f9ff"} onMouseLeave={ev => ev.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#0369a1", fontSize: 12 }}>{strPad(eq.tombo)}</td>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{CATEGORIAS_ICONES[eq.categoria]}</span> {eq.categoria}
                </td>
                <td style={{ padding: "12px 14px", fontWeight: 500, maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={eq.descricao}>{eq.descricao}</td>
                <td style={{ padding: "12px 14px", color: "#64748b", fontSize: 12, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={eq.lotacao}>{eq.lotacao}</td>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: eq.idade > 15 ? "#dc2626" : eq.idade > 9 ? "#b45309" : "#16a34a" }}>{eq.idade} anos</td>
                <td style={{ padding: "12px 14px", fontWeight: 600, fontFamily: "monospace" }}>R$ {brl(eq.valorBaixa)}</td>
                <td style={{ padding: "12px 14px" }}><BadgeFase fase={eq.fase} /></td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Nenhum equipamento encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {detalhe && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setDetalhe(null)}>
          <div onClick={ev => ev.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500, padding: 28, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace", marginBottom: 4, fontWeight: 600 }}>TOMBO: {strPad(detalhe.tombo)}</div>
                <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3, color: "#0f172a" }}>{detalhe.descricao}</div>
              </div>
              <BadgeFase fase={detalhe.fase} />
            </div>

            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>LOTAÇÃO</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{detalhe.lotacao}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: detalhe.fase === 1 ? "#fef2f2" : "#f8fafc", borderRadius: 10, padding: "12px 16px", border: detalhe.fase === 1 ? "1px solid #fca5a5" : "none" }}>
                  <div style={{ fontSize: 11, color: detalhe.fase === 1 ? "#dc2626" : "#94a3b8", fontWeight: 600, marginBottom: 4 }}>DATA AQUISIÇÃO / IDADE</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: detalhe.fase === 1 ? "#b91c1c" : "#0f172a" }}>
                    {new Date(detalhe.aquisicao).toLocaleDateString("pt-BR")} ({detalhe.idade} anos)
                  </div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>VALOR ATUALIZADO (BAIXA)</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>R$ {brl(detalhe.valorBaixa)}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              {detalhe.fase === 1 && (
                <button style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Autorizar Desfazimento
                </button>
              )}
              <button onClick={() => setDetalhe(null)} style={{ background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── App Principal ─────────────────────────────────────────────────────────
export default function App() {
  const [aba, setAba] = useState("visao_geral");

  const abasMenu = [
    { id: "visao_geral", label: "Visão Geral do Plano" },
    { id: "fase1", label: "Ação Imediata (Fase 1)" },
    { id: "inventario", label: "Inventário Completo" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#0f172a" }}>
      {/* Navbar Mapeamento Patrimonial */}
      <div style={{ background: "#0f172a", color: "#fff", padding: "0 24px", display: "flex", alignItems: "center", height: 64, gap: 20, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#38bdf8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            ♻️
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -.3, lineHeight: 1.1 }}>SGE - EcoTroca</div>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: .5, fontWeight: 500 }}>SISTEMA DE GESTÃO ENERGÉTICA</div>
          </div>
        </div>
        
        <div style={{ width: 1, height: 30, background: "#334155", marginLeft: 10, marginRight: 10 }} />

        <div style={{ display: "flex", gap: 6, flex: 1 }}>
          {abasMenu.map(menu => (
            <button 
              key={menu.id} 
              onClick={() => setAba(menu.id)} 
              style={{ 
                background: aba === menu.id ? "#1e293b" : "transparent", 
                border: "none", 
                borderRadius: 8, 
                padding: "8px 16px", 
                fontSize: 13, 
                fontWeight: aba === menu.id ? 700 : 500, 
                color: aba === menu.id ? "#38bdf8" : "#cbd5e1", 
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {menu.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Manutenção Federal</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Perfil: Gestor Operacional</div>
          </div>
          <div style={{ width: 36, height: 36, background: "#1e293b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold", border: "1px solid #334155" }}>
            MF
          </div>
        </div>
      </div>

      {/* Renderização condicional das abas */}
      {aba === "visao_geral" && <PainelVisaoGeral setAba={setAba} />}
      {aba === "fase1" && <PainelFase1 />}
      {aba === "inventario" && <PainelInventario />}
    </div>
  );
}
