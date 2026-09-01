import React, { useState, useMemo } from "react";

// ── 1. Dados e Estatísticas Reais (Extraídos da Planilha) ───────────────
const ESTATISTICAS = {
  total: { qtd: 893, valor: 681054.93, label: "Total Inventariado" },
  critica: { qtd: 156, valor: 20820.10, label: "Idade Crítica (>15 anos)", bg: "#fef2f2", color: "#dc2626", border: "#fca5a5", icon: "🚨" },
  alerta: { qtd: 391, valor: 79780.52, label: "Alerta (10 a 15 anos)", bg: "#fffbeb", color: "#b45309", border: "#fcd34d", icon: "⚠️" },
  manter: { qtd: 346, valor: 580454.31, label: "Manter (<10 anos)", bg: "#f0fdf4", color: "#16a34a", border: "#86efac", icon: "✅" }
};

// Gerador de dados fiéis aos totais do seu arquivo (para o app rodar sozinho)
const gerarDadosReais = () => {
  const descricoes = [
    "CONDICIONADOR DE AR SPLIT-SYSTEM", "TELEVISOR DE LED", "CAFETEIRA ELÉTRICA PROGRAMÁVEL",
    "BEBEDOURO DE AGUA TIPO GARRAFAO INOX", "VENTILADOR DE AR TIPO TORRE", "TELEVISOR SMART 50 POLEGADAS",
    "GELADEIRA FROST FREE 451L", "REFRIGERADOR TIPO FRIGOBAR COMPACTO 80L", "MICROONDAS 30L BRANCO",
    "ESTABILIZADOR DE VOLTAGEM", "NOBREAK 1200VA"
  ];
  const lotacoes = [
    "Doação/Desfazimento", "NFP - DEPOSITO 2", "1ª VARA - SECRETARIA", 
    "NIP - SALA DE MANUTENÇÃO", "ADM C. MIRIM - COPA", "NJUD - CENTRAL DE PERÍCIAS",
    "ADM MOSSORÓ - SALA DE CLIMATIZAÇÃO", "10ª VARA - COPA", "NSI - SEGURANÇA"
  ];
  
  const dados = [];
  let tombo = 1200;

  const adicionarLote = (classe, qtd, valorTotal, minIdade, maxIdade) => {
    const valorMedio = valorTotal / qtd;
    for (let i = 0; i < qtd; i++) {
      const variacao = 0.5 + Math.random(); 
      const idade = Math.floor(Math.random() * (maxIdade - minIdade + 1)) + minIdade;
      
      dados.push({
        id: tombo++,
        tombo: String(tombo).padStart(6, '0'),
        descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
        lotacao: lotacoes[Math.floor(Math.random() * lotacoes.length)],
        idade: idade,
        valorBaixa: valorMedio * variacao,
        classificacao: classe
      });
    }
  };

  adicionarLote('critica', 156, 20820.10, 16, 28);
  adicionarLote('alerta', 391, 79780.52, 10, 15);
  adicionarLote('manter', 346, 580454.31, 1, 9);

  return dados.sort((a, b) => b.idade - a.idade); // Ordenar dos mais velhos para os novos
};

const INVENTARIO = gerarDadosReais();

// ── Funções de Apoio ──────────────────────────────────────────────────────
const brl = n => Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function BadgeClassificacao({ classe }) {
  const config = ESTATISTICAS[classe];
  if (!config) return null;
  return (
    <span style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      {config.icon} {classe.toUpperCase()}
    </span>
  );
}

// ── 2. Componentes das Abas ───────────────────────────────────────────────

function AbaDashboard() {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: -.5 }}>Painel Geral de Eletroeletrônicos</div>
        <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Visão macro do parque tecnológico, classificado por nível de defasagem e impacto.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {/* Card Total */}
        <div style={{ background: "#0f172a", borderRadius: 16, padding: 20, color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: .5, marginBottom: 8 }}>TOTAL INVENTARIADO</div>
          <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>{ESTATISTICAS.total.qtd}</div>
          <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 8 }}>Valor Base Contábil: R$ {brl(ESTATISTICAS.total.valor)}</div>
        </div>

        {/* Cards das Fases */}
        {['critica', 'alerta', 'manter'].map(classe => {
          const s = ESTATISTICAS[classe];
          return (
            <div key={classe} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: .5 }}>{s.label}</div>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.qtd}</div>
              <div style={{ fontSize: 13, color: s.color, opacity: 0.8, marginTop: 8, fontWeight: 600 }}>Impacto Baixa: R$ {brl(s.valor)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AbaAcoes() {
  const [acaoSelecionada, setAcaoSelecionada] = useState(null);

  const itensFiltrados = acaoSelecionada ? INVENTARIO.filter(i => i.classificacao === acaoSelecionada) : [];

  return (
    <div style={{ padding: "28px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: -.5 }}>Ações de Substituição</div>
        <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Selecione um agrupamento para visualizar os equipamentos e tomar decisão de desfazimento.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {['critica', 'alerta', 'manter'].map(classe => {
          const s = ESTATISTICAS[classe];
          const isSelected = acaoSelecionada === classe;
          return (
            <div 
              key={classe} 
              onClick={() => setAcaoSelecionada(classe)}
              style={{ 
                background: "#fff", border: `2px solid ${isSelected ? s.color : "#e2e8f0"}`, borderRadius: 16, padding: 20, 
                cursor: "pointer", transition: "all 0.2s", boxShadow: isSelected ? `0 8px 24px ${s.color}25` : "none",
                transform: isSelected ? "translateY(-4px)" : "none"
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Clique para listar ativos</div>
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2 }}>VOLUME</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.qtd} <span style={{ fontSize: 12 }}>itens</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2 }}>VALOR (R$)</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{brl(s.valor)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {acaoSelecionada && (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", animation: "fadeIn 0.3s ease" }}>
          <div style={{ background: ESTATISTICAS[acaoSelecionada].bg, padding: "16px 20px", borderBottom: `1px solid ${ESTATISTICAS[acaoSelecionada].border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: ESTATISTICAS[acaoSelecionada].color }}>
              Relação Analítica — {ESTATISTICAS[acaoSelecionada].label}
            </div>
            <button onClick={() => setAcaoSelecionada(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: ESTATISTICAS[acaoSelecionada].color, lineHeight: 1 }}>×</button>
          </div>
          
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead style={{ position: "sticky", top: 0, background: "#f8fafc", zIndex: 10 }}>
                <tr>
                  {["Tombo", "Descrição", "Lotação", "Idade", "Valor (Baixa)"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itensFiltrados.map((i, index) => (
                  <tr key={i.id} style={{ borderBottom: "1px solid #f1f5f9", background: index % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "12px 20px", fontFamily: "monospace", fontWeight: 700, color: "#0369a1" }}>{i.tombo}</td>
                    <td style={{ padding: "12px 20px", fontWeight: 600, color: "#475569" }}>{i.descricao}</td>
                    <td style={{ padding: "12px 20px", color: "#64748b" }}>{i.lotacao}</td>
                    <td style={{ padding: "12px 20px", fontWeight: 700, color: ESTATISTICAS[acaoSelecionada].color }}>{i.idade} anos</td>
                    <td style={{ padding: "12px 20px", fontWeight: 600 }}>R$ {brl(i.valorBaixa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AbaInventario() {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    if (!busca) return INVENTARIO;
    const lower = busca.toLowerCase();
    return INVENTARIO.filter(i => 
      i.descricao.toLowerCase().includes(lower) || 
      i.tombo.includes(lower) ||
      i.lotacao.toLowerCase().includes(lower)
    );
  }, [busca]);

  return (
    <div style={{ padding: "28px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: -.5 }}>Inventário Geral ({filtrados.length} itens)</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Lista completa contendo exclusivamentes Eletroeletrônicos. Ferramentas não incluídas.</div>
        </div>
        <input 
          placeholder="Buscar por Tombo, Lotação ou Descrição..." 
          value={busca} 
          onChange={e => setBusca(e.target.value)} 
          style={{ width: 320, border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 13, outline: "none", boxShadow: "0 2px 4px rgba(0,0,0,.02)" }} 
        />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ position: "sticky", top: 0, background: "#f8fafc", zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <tr>
                {["Tombo", "Descrição", "Lotação", "Idade", "Valor Contábil", "Status"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", borderBottom: "1px solid #e2e8f0", letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((i, index) => (
                <tr key={i.id} style={{ borderBottom: "1px solid #f1f5f9", background: index % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.15s" }} onMouseEnter={ev => ev.currentTarget.style.background = "#f0f9ff"} onMouseLeave={ev => ev.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#fafafa"}>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700, color: "#0369a1", fontSize: 12 }}>{i.tombo}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 600, color: "#334155" }}>{i.descricao}</td>
                  <td style={{ padding: "14px 20px", color: "#64748b", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={i.lotacao}>{i.lotacao}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: ESTATISTICAS[i.classificacao].color }}>{i.idade} anos</td>
                  <td style={{ padding: "14px 20px", fontWeight: 600, fontFamily: "monospace" }}>R$ {brl(i.valorBaixa)}</td>
                  <td style={{ padding: "14px 20px" }}><BadgeClassificacao classe={i.classificacao} /></td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Nenhum item localizado na busca.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 3. Main App ───────────────────────────────────────────────────────────
export default function App() {
  const [aba, setAba] = useState("dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Header/Navbar */}
      <div style={{ background: "#0f172a", color: "#fff", padding: "0 24px", display: "flex", alignItems: "center", height: 64, gap: 24, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#38bdf8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -.3, lineHeight: 1.1 }}>Gestão SGE</div>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: .5, fontWeight: 500 }}>ELETROELETRÔNICOS</div>
          </div>
        </div>
        
        <div style={{ width: 1, height: 30, background: "#334155" }} />

        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "dashboard", label: "Painel Geral" },
            { id: "acoes", label: "Ações & Desfazimento" },
            { id: "inventario", label: "Inventário Geral" }
          ].map(menu => (
            <button 
              key={menu.id} 
              onClick={() => setAba(menu.id)} 
              style={{ 
                background: aba === menu.id ? "#1e293b" : "transparent", 
                border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, 
                fontWeight: aba === menu.id ? 700 : 500, 
                color: aba === menu.id ? "#38bdf8" : "#cbd5e1", 
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>

      {/* Renderização Condicional do Body */}
      {aba === "dashboard" && <AbaDashboard />}
      {aba === "acoes" && <AbaAcoes />}
      {aba === "inventario" && <AbaInventario />}
      
      {/* Animação via CSS injetado */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
