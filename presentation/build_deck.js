const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.author = "IE Agentic AI Team";
p.title = "Supply Chain Risk Console";

const W = 13.33, H = 7.5, M = 0.6;
const BG = "0A0E16", PANEL = "131A26", CARD = "1B2433", LINE = "2A3547";
const PRIMARY = "8B8DFF", PRIMARYL = "C0C1FF", AMBER = "FFB783", RED = "FF8A93",
      GREEN = "5BE08C", TEXT = "ECEAF6", MUTED = "AAB4C8", DIM = "8694A8";
const HEAD = "Trebuchet MS", BODY = "Arial";
const sh = () => ({ type: "outer", color: "000000", blur: 9, offset: 3, angle: 90, opacity: 0.35 });

let page = 0;
function slide() { const s = p.addSlide(); s.background = { color: BG }; return s; }
function pageNum(s) {
  page++;
  s.addText(String(page).padStart(2,"0"), { x: W-1.0, y: H-0.5, w: 0.6, h: 0.3, fontFace: BODY, fontSize: 9, color: DIM, align: "right" });
  s.addText("Supply Chain Risk Console · Agentic AI", { x: M, y: H-0.5, w: 7, h: 0.3, fontFace: BODY, fontSize: 9, color: DIM });
}
function heading(s, kicker, title) {
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 0.55, w: 0.14, h: 0.5, fill: { color: PRIMARY } });
  s.addText(kicker.toUpperCase(), { x: M+0.28, y: 0.5, w: 11, h: 0.3, fontFace: BODY, fontSize: 11, color: PRIMARY, charSpacing: 3, bold: true, margin: 0 });
  s.addText(title, { x: M+0.26, y: 0.78, w: 12, h: 0.7, fontFace: HEAD, fontSize: 30, color: TEXT, bold: true, margin: 0 });
}
function card(s, x, y, w, h, fill) {
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.09, fill: { color: fill || CARD }, line: { color: LINE, width: 1 }, shadow: sh() });
}

/* 1 TITLE */
{
  const s = slide();
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: H, fill: { color: PRIMARY } });
  s.addText("IE UNIVERSITY  ·  AGENTIC AI", { x: M+0.2, y: 1.5, w: 10, h: 0.4, fontFace: BODY, fontSize: 14, color: PRIMARY, charSpacing: 3, bold: true });
  s.addText("Supply Chain Risk Console", { x: M+0.15, y: 2.0, w: 12, h: 1.1, fontFace: HEAD, fontSize: 52, color: TEXT, bold: true });
  s.addText("An agentic-AI decision platform for Titan Manufacturing — load supply-chain data, run an autonomous risk analysis with costs, and chat with the agent.",
    { x: M+0.2, y: 3.15, w: 9.6, h: 1.0, fontFace: BODY, fontSize: 17, color: MUTED, lineSpacing: 24 });
  const chips = ["CrewAI multi-agent", "LightGBM risk model", "Live on the VPS"];
  chips.forEach((c, i) => {
    const x = M+0.2 + i*3.0;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: 4.5, w: 2.8, h: 0.5, rectRadius: 0.25, fill: { color: CARD }, line: { color: PRIMARY, width: 1 } });
    s.addText(c, { x, y: 4.5, w: 2.8, h: 0.5, fontFace: BODY, fontSize: 12, color: PRIMARYL, align: "center", valign: "middle", bold: true });
  });
  s.addText([{ text: "agenticai.srv1487908.hstgr.cloud", options: { color: PRIMARYL, bold: true } },
    { text: "    ·    github.com/cmiebach/agentic_ai", options: { color: MUTED } }],
    { x: M+0.2, y: 5.6, w: 12, h: 0.4, fontFace: BODY, fontSize: 13 });
  s.addText([{ text: "TEAM   ", options: { color: PRIMARY, bold: true, charSpacing: 2 } },
    { text: "Ricardo · Antonio · Max · Caspar · Nicklas", options: { color: TEXT } }],
    { x: M+0.2, y: 6.2, w: 12, h: 0.4, fontFace: BODY, fontSize: 14 });
}

/* 2 CHALLENGE */
{
  const s = slide();
  heading(s, "The challenge", "Titan Manufacturing is losing money to supply-chain volatility");
  const stats = [
    { v: "+28%", l: "supplier delivery delays", c: RED },
    { v: "$14M", l: "line-stoppage losses / quarter", c: RED },
    { v: "+52%", l: "expedited-logistics costs", c: AMBER },
    { v: "0", l: "visibility beyond Tier-1 suppliers", c: AMBER },
  ];
  const cw = 2.85, gap = 0.32, y0 = 1.95;
  stats.forEach((st, i) => {
    const x = M + i*(cw+gap);
    card(s, x, y0, cw, 2.3);
    s.addShape(p.shapes.RECTANGLE, { x, y: y0, w: cw, h: 0.10, fill: { color: st.c } });
    s.addText(st.v, { x: x+0.1, y: y0+0.4, w: cw-0.2, h: 1.0, fontFace: HEAD, fontSize: 46, color: st.c, bold: true, align: "center" });
    s.addText(st.l, { x: x+0.2, y: y0+1.5, w: cw-0.4, h: 0.7, fontFace: BODY, fontSize: 13, color: MUTED, align: "center" });
  });
  s.addText("56,000 employees · 28 plants · 14 countries — yet decisions are manual and reactive, with data scattered across SCADA, EDI feeds, email and spreadsheets.",
    { x: M, y: 4.7, w: 12.1, h: 0.8, fontFace: BODY, fontSize: 15, color: TEXT, italic: true });
  pageNum(s);
}

/* 3 ROOT CAUSE */
{
  const s = slide();
  heading(s, "Root cause", "Fragmented operational intelligence");
  card(s, M, 1.9, 5.9, 4.3);
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 1.9, w: 0.12, h: 4.3, fill: { color: RED } });
  s.addText("Today", { x: M+0.4, y: 2.15, w: 5, h: 0.4, fontFace: HEAD, fontSize: 18, color: RED, bold: true });
  s.addText([
    { text: "Isolated systems — SCADA, MES, ERP, vendor portals don’t talk", options: { bullet: true, breakLine: true } },
    { text: "Entirely manual decision loops; problems found only after a stall", options: { bullet: true, breakLine: true } },
    { text: "No visibility into Tier-2 suppliers or real-time ETAs", options: { bullet: true, breakLine: true } },
    { text: "Teams blame each other — maintenance, procurement, logistics", options: { bullet: true } },
  ], { x: M+0.4, y: 2.75, w: 5.2, h: 3.2, fontFace: BODY, fontSize: 14.5, color: TEXT, valign: "top", paraSpaceAfter: 12, lineSpacing: 20 });
  card(s, M+6.3, 1.9, 5.8, 4.3, PANEL);
  s.addShape(p.shapes.RECTANGLE, { x: M+6.3, y: 1.9, w: 0.12, h: 4.3, fill: { color: PRIMARY } });
  s.addText("With Agentic AI", { x: M+6.7, y: 2.15, w: 5, h: 0.4, fontFace: HEAD, fontSize: 18, color: PRIMARYL, bold: true });
  s.addText([
    { text: "Autonomous agents that perceive, decide and act on the data", options: { bullet: true, breakLine: true } },
    { text: "Unify scattered sources into one analysed workspace", options: { bullet: true, breakLine: true } },
    { text: "Predict & flag risk proactively — before the line stops", options: { bullet: true, breakLine: true } },
    { text: "Quantify exposure in $ and recommend the next action", options: { bullet: true } },
  ], { x: M+6.7, y: 2.75, w: 5.2, h: 3.2, fontFace: BODY, fontSize: 14.5, color: TEXT, valign: "top", paraSpaceAfter: 12, lineSpacing: 20 });
  pageNum(s);
}

/* 4 FIVE CHALLENGES */
{
  const s = slide();
  heading(s, "Case study", "Agentic AI opportunities across Titan’s 5 challenges");
  const rows = [
    ["1","Predictive maintenance","RUL-prediction agent prioritises 22k daily sensor alerts; auto-schedules maintenance."],
    ["2","Supply chain volatility & risk","Tier-2 risk sentinel + ETA prediction — OUR BUILD focuses here."],
    ["3","Human–robot coordination","Scheduling agent re-plans robot cells around real-time staffing & safety."],
    ["4","Quality & traceability","Root-cause agent links MES/QMS to robotics telemetry to trace defects in minutes."],
    ["5","Compliance, safety & audit","Audit agent auto-reconstructs incidents across 20+ siloed systems."],
  ];
  let y = 1.95; const rh = 0.92;
  rows.forEach((r) => {
    const focus = r[0] === "2";
    card(s, M, y, 12.1, rh-0.14, focus ? PANEL : CARD);
    if (focus) s.addShape(p.shapes.RECTANGLE, { x: M, y, w: 0.12, h: rh-0.14, fill: { color: PRIMARY } });
    s.addShape(p.shapes.OVAL, { x: M+0.28, y: y+0.16, w: 0.46, h: 0.46, fill: { color: focus ? PRIMARY : CARD }, line: { color: focus ? PRIMARY : LINE, width: 1.5 } });
    s.addText(r[0], { x: M+0.28, y: y+0.16, w: 0.46, h: 0.46, fontFace: HEAD, fontSize: 18, color: focus ? "0A0E16" : PRIMARYL, bold: true, align: "center", valign: "middle" });
    s.addText(r[1], { x: M+1.0, y: y+0.05, w: 4.1, h: rh-0.2, fontFace: HEAD, fontSize: 15, color: focus ? PRIMARYL : TEXT, bold: true, valign: "middle" });
    s.addText(r[2], { x: M+5.2, y: y+0.05, w: 6.7, h: rh-0.2, fontFace: BODY, fontSize: 12.5, color: MUTED, valign: "middle" });
    y += rh;
  });
  pageNum(s);
}

/* 5 SOLUTION */
{
  const s = slide();
  heading(s, "Our solution", "Supply Chain Risk Console");
  s.addText("A password-gated web app: load a supply-chain data source, run a full risk analysis with costs, and chat with the agent — everything runs server-side.",
    { x: M, y: 1.65, w: 12, h: 0.7, fontFace: BODY, fontSize: 15, color: TEXT });
  const feats = [
    ["Any data source","Upload CSV/XLSX, connect SAP/Odoo/Dynamics, public USAID data, or a synthetic generator."],
    ["Full risk analysis","Suppliers + logistics (sea/air/road/rail) with quantified cost-at-risk."],
    ["Real ML model","A LightGBM model predicts per-supplier late-delivery risk + explains it."],
    ["Persistent chat","Ask questions and run focused re-analyses over the loaded data."],
  ];
  const cw = 2.85, gap = 0.32, y0 = 2.55;
  feats.forEach((f, i) => {
    const x = M + i*(cw+gap);
    card(s, x, y0, cw, 3.1);
    s.addShape(p.shapes.OVAL, { x: x+0.3, y: y0+0.3, w: 0.6, h: 0.6, fill: { color: PANEL }, line: { color: PRIMARY, width: 1.5 } });
    s.addText("✦", { x: x+0.3, y: y0+0.3, w: 0.6, h: 0.6, fontFace: BODY, fontSize: 20, color: PRIMARYL, align: "center", valign: "middle" });
    s.addText(f[0], { x: x+0.25, y: y0+1.05, w: cw-0.5, h: 0.5, fontFace: HEAD, fontSize: 16, color: TEXT, bold: true });
    s.addText(f[1], { x: x+0.25, y: y0+1.55, w: cw-0.5, h: 1.4, fontFace: BODY, fontSize: 12.5, color: MUTED, lineSpacing: 17 });
  });
  pageNum(s);
}

/* 6 PIPELINE */
{
  const s = slide();
  heading(s, "How it works", "From raw data to a board-ready briefing");
  const steps = [
    ["1","Load","Upload, connect an ERP, or generate data → one normalised workspace."],
    ["2","Enrich","Attach a simulated logistics-risk layer + run the LightGBM model."],
    ["3","Analyse","A two-agent crew writes the risk briefing, grounded in the numbers."],
    ["4","Converse","Chat answers questions & focused re-analyses over the workspace."],
  ];
  const cw = 2.78, gap = 0.34, y0 = 2.4;
  steps.forEach((st, i) => {
    const x = M + i*(cw+gap);
    card(s, x, y0, cw, 2.9);
    s.addShape(p.shapes.OVAL, { x: x+cw/2-0.38, y: y0+0.35, w: 0.76, h: 0.76, fill: { color: PRIMARY } });
    s.addText(st[0], { x: x+cw/2-0.38, y: y0+0.35, w: 0.76, h: 0.76, fontFace: HEAD, fontSize: 26, color: "0A0E16", bold: true, align: "center", valign: "middle" });
    s.addText(st[1], { x: x+0.2, y: y0+1.3, w: cw-0.4, h: 0.5, fontFace: HEAD, fontSize: 17, color: PRIMARYL, bold: true, align: "center" });
    s.addText(st[2], { x: x+0.25, y: y0+1.85, w: cw-0.5, h: 1.0, fontFace: BODY, fontSize: 12.5, color: MUTED, align: "center", lineSpacing: 16 });
    if (i < 3) s.addText("→", { x: x+cw+0.02, y: y0+0.9, w: 0.3, h: 0.6, fontFace: HEAD, fontSize: 22, color: PRIMARY, align: "center", valign: "middle" });
  });
  pageNum(s);
}

/* 7 ARCHITECTURE */
{
  const s = slide();
  heading(s, "Architecture", "A CrewAI multi-agent system");
  const ay = 2.2, aw = 3.4, ah = 1.7;
  const agents = [
    [M+0.4, "Data Analyst", "Reads the data + logistics; ranks the quantified risks and worst shipments."],
    [M+4.45, "Risk Strategist", "Turns findings into a costed briefing + Agentic AI opportunities."],
    [M+8.5, "Chat Agent", "Answers questions & focused re-analysis, grounded in the workspace."],
  ];
  agents.forEach((a, i) => {
    card(s, a[0], ay, aw, ah, PANEL);
    s.addShape(p.shapes.RECTANGLE, { x: a[0], y: ay, w: aw, h: 0.1, fill: { color: PRIMARY } });
    s.addText(a[1], { x: a[0]+0.25, y: ay+0.25, w: aw-0.5, h: 0.4, fontFace: HEAD, fontSize: 17, color: TEXT, bold: true });
    s.addText(a[2], { x: a[0]+0.25, y: ay+0.72, w: aw-0.5, h: 0.9, fontFace: BODY, fontSize: 12.5, color: MUTED, lineSpacing: 16 });
    if (i < 2) s.addText("→", { x: a[0]+aw+0.02, y: ay+0.5, w: 0.6, h: 0.6, fontFace: HEAD, fontSize: 24, color: PRIMARY, align: "center", valign: "middle" });
  });
  card(s, M, 4.4, 5.9, 1.7, CARD);
  s.addText("Engines", { x: M+0.25, y: 4.55, w: 5, h: 0.35, fontFace: HEAD, fontSize: 14, color: PRIMARYL, bold: true });
  s.addText([
    { text: "Primary: Ollama kimi-k2.7-code (on the VPS, fast, uncapped)", options: { bullet: true, breakLine: true } },
    { text: "Automatic fallback: Google Gemini 2.5 Flash-Lite", options: { bullet: true } },
  ], { x: M+0.25, y: 4.95, w: 5.4, h: 1.0, fontFace: BODY, fontSize: 12.5, color: TEXT, paraSpaceAfter: 6, lineSpacing: 17 });
  card(s, M+6.2, 4.4, 5.9, 1.7, CARD);
  s.addText("Guardrails", { x: M+6.45, y: 4.55, w: 5, h: 0.35, fontFace: HEAD, fontSize: 14, color: GREEN, bold: true });
  s.addText([
    { text: "Prompt-injection & scope guard; untrusted data isolated", options: { bullet: true, breakLine: true } },
    { text: "Agents have no tools/secrets — injection can’t take actions", options: { bullet: true } },
  ], { x: M+6.45, y: 4.95, w: 5.4, h: 1.0, fontFace: BODY, fontSize: 12.5, color: TEXT, paraSpaceAfter: 6, lineSpacing: 17 });
  pageNum(s);
}

/* 8 DATA SOURCES */
{
  const s = slide();
  heading(s, "Integrations", "Plug in any supply-chain data source");
  const items = [
    ["Upload CSV / XLSX","Arbitrary files auto-profiled (50+ columns, 50k rows)."],
    ["SAP S/4HANA","Simulated OData feed — LIFNR / EBELN / MATNR fields."],
    ["Odoo","Simulated JSON-RPC — res.partner / purchase.order."],
    ["MS Dynamics 365","Simulated OData v4 — VendorAccount / PurchId."],
    ["Public dataset (USAID)","Real, login-free shipment-pricing CSV."],
    ["Synthetic generator","Seeded, reproducible — risk patterns baked in."],
  ];
  const cw = 3.86, ch = 1.55, gx = 0.3, gy = 0.3, y0 = 2.0;
  items.forEach((it, i) => {
    const col = i%3, row = Math.floor(i/3);
    const x = M + col*(cw+gx), y = y0 + row*(ch+gy);
    card(s, x, y, cw, ch);
    s.addShape(p.shapes.RECTANGLE, { x, y: y+0.25, w: 0.1, h: ch-0.5, fill: { color: PRIMARY } });
    s.addText(it[0], { x: x+0.3, y: y+0.22, w: cw-0.5, h: 0.4, fontFace: HEAD, fontSize: 15, color: TEXT, bold: true });
    s.addText(it[1], { x: x+0.3, y: y+0.66, w: cw-0.5, h: 0.8, fontFace: BODY, fontSize: 12, color: MUTED, lineSpacing: 15 });
  });
  s.addText("Connectors + logistics signals are simulated and clearly labelled; production points the same connector at a real system via env config.",
    { x: M, y: 6.35, w: 12, h: 0.5, fontFace: BODY, fontSize: 12, color: DIM, italic: true });
  pageNum(s);
}

/* 9 LOGISTICS + ML */
{
  const s = slide();
  heading(s, "Risk engine", "Logistics risk + a LightGBM late-delivery model");
  card(s, M, 1.95, 5.0, 4.25, PANEL);
  s.addText("Simulated in-transit shipments", { x: M+0.3, y: 2.15, w: 4.5, h: 0.4, fontFace: HEAD, fontSize: 15, color: PRIMARYL, bold: true });
  const ls = [["$240K","expected delay cost",AMBER],["$4.8M","value in transit",TEXT],["3 / 14","shipments ≥50% delay risk",RED]];
  ls.forEach((st, i) => {
    const y = 2.65 + i*1.12;
    s.addText(st[0], { x: M+0.3, y, w: 2.0, h: 0.7, fontFace: HEAD, fontSize: 30, color: st[2], bold: true });
    s.addText(st[1], { x: M+2.35, y: y+0.12, w: 2.5, h: 0.7, fontFace: BODY, fontSize: 12.5, color: MUTED, valign: "middle" });
  });
  s.addText("Sea · Air · Road · Rail — each scored on weather, port congestion & lane risk.",
    { x: M+0.3, y: 5.6, w: 4.5, h: 0.5, fontFace: BODY, fontSize: 11.5, color: DIM, italic: true });
  s.addText("Feature importance — what drives late delivery", { x: M+5.5, y: 1.95, w: 6.5, h: 0.4, fontFace: HEAD, fontSize: 15, color: PRIMARYL, bold: true });
  s.addChart(p.charts.BAR, [{ name: "Importance", labels: ["on-time rate","lead-time CoV","annual spend","single-source","high-risk region"], values: [33,26,17,13,11] }], {
    x: M+5.4, y: 2.5, w: 6.7, h: 3.5, barDir: "bar",
    chartColors: [PRIMARY], chartArea: { fill: { color: BG } }, plotArea: { fill: { color: BG } },
    catAxisLabelColor: MUTED, catAxisLabelFontFace: BODY, catAxisLabelFontSize: 11,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showValue: true, dataLabelColor: TEXT, dataLabelFontFace: BODY, dataLabelFontSize: 11, dataLabelPosition: "outEnd",
    showLegend: false, showTitle: false, valAxisMaxVal: 40, barGapWidthPct: 40,
  });
  s.addText("Trained on a simulated history — holdout AUC ≈ 0.7. The pipeline (features → train → predict → explain) is real.",
    { x: M+5.4, y: 6.1, w: 6.8, h: 0.5, fontFace: BODY, fontSize: 11, color: DIM, italic: true });
  pageNum(s);
}

/* 10 OPPORTUNITIES DEEP */
{
  const s = slide();
  heading(s, "The deliverable", "Three Agentic AI opportunities — mapped to cost");
  const ops = [
    ["Tier-2 Risk Sentinel","Continuously maps sub-tier dependencies and flags single-source / high-risk-country exposure before it stalls production.","De-risks the $21M single-source × Tier-2 exposure"],
    ["Predictive Delivery & Expediting","Watches delay signals per shipment; auto-triggers expediting & safety-stock when delay probability spikes.","Cuts the $240K expected delay cost"],
    ["Dynamic Dual-Sourcing","Proposes & qualifies alternate suppliers when concentration or OTD thresholds are breached.","Attacks the $14M line-stoppage losses"],
  ];
  let y = 1.95; const rh = 1.42;
  ops.forEach((o) => {
    card(s, M, y, 12.1, rh-0.16, PANEL);
    s.addShape(p.shapes.RECTANGLE, { x: M, y, w: 0.12, h: rh-0.16, fill: { color: PRIMARY } });
    s.addText(o[0], { x: M+0.35, y: y+0.16, w: 4.3, h: rh-0.4, fontFace: HEAD, fontSize: 17, color: PRIMARYL, bold: true, valign: "middle" });
    s.addText(o[1], { x: M+4.75, y: y+0.18, w: 4.6, h: rh-0.36, fontFace: BODY, fontSize: 12.5, color: TEXT, valign: "middle", lineSpacing: 16 });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: M+9.5, y: y+0.22, w: 2.45, h: rh-0.56, rectRadius: 0.08, fill: { color: CARD }, line: { color: GREEN, width: 1 } });
    s.addText(o[2], { x: M+9.6, y: y+0.26, w: 2.25, h: rh-0.62, fontFace: BODY, fontSize: 11, color: GREEN, valign: "middle", align: "center", bold: true });
    y += rh;
  });
  pageNum(s);
}

/* 11 DEMO */
{
  const s = slide();
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: H, fill: { color: PRIMARY } });
  s.addText("LIVE DEMO", { x: M+0.2, y: 1.4, w: 8, h: 0.5, fontFace: BODY, fontSize: 16, color: PRIMARY, charSpacing: 4, bold: true });
  s.addText("See it run", { x: M+0.15, y: 1.9, w: 10, h: 1.0, fontFace: HEAD, fontSize: 46, color: TEXT, bold: true });
  card(s, M+0.2, 3.15, 6.6, 1.0, CARD);
  s.addText([{ text: "agenticai.srv1487908.hstgr.cloud", options: { color: PRIMARYL, bold: true, breakLine: true } },
    { text: "password: agenticai", options: { color: MUTED, fontSize: 13 } }],
    { x: M+0.5, y: 3.25, w: 6.2, h: 0.8, fontFace: BODY, fontSize: 17, valign: "middle" });
  s.addText([
    { text: "1.   Generate a synthetic dataset (or connect SAP)", options: { breakLine: true } },
    { text: "2.   Watch KPIs, the data table, logistics risk & the ML card populate", options: { breakLine: true } },
    { text: "3.   Run the risk analysis → a costed, board-ready briefing", options: { breakLine: true } },
    { text: "4.   Ask the chat: “which shipment has the highest delay cost?”", options: {} },
  ], { x: M+0.2, y: 4.5, w: 11.5, h: 2.2, fontFace: BODY, fontSize: 16, color: TEXT, paraSpaceAfter: 12, lineSpacing: 22 });
}

/* 12 ENGINEERING */
{
  const s = slide();
  heading(s, "Engineering", "Built to run autonomously & securely");
  const cols = [
    ["Stack", ["FastAPI + CrewAI backend","Tailwind dashboard (buildless)","One Docker container behind Traefik (auto-TLS)"], PRIMARY],
    ["Autonomous", ["Auto-restarts on crash","Survives VPS reboots","Health-checked every 30s"], AMBER],
    ["Secure", ["Password + brute-force lockout","Rate limiting + input caps","Prompt-injection / scope guard"], GREEN],
  ];
  const cw = 3.86, gx = 0.3, y0 = 2.1;
  cols.forEach((c, i) => {
    const x = M + i*(cw+gx);
    card(s, x, y0, cw, 3.3);
    s.addShape(p.shapes.RECTANGLE, { x, y: y0, w: cw, h: 0.1, fill: { color: c[2] } });
    s.addText(c[0], { x: x+0.3, y: y0+0.35, w: cw-0.6, h: 0.5, fontFace: HEAD, fontSize: 19, color: TEXT, bold: true });
    s.addText(c[1].map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < c[1].length-1 } })),
      { x: x+0.3, y: y0+1.0, w: cw-0.6, h: 2.1, fontFace: BODY, fontSize: 13.5, color: MUTED, valign: "top", paraSpaceAfter: 12, lineSpacing: 19 });
  });
  pageNum(s);
}

/* 13 SCOPE */
{
  const s = slide();
  heading(s, "Honest scope", "What’s real, what’s simulated");
  card(s, M, 2.0, 5.9, 4.0, CARD);
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 2.0, w: 0.12, h: 4.0, fill: { color: AMBER } });
  s.addText("Simulated (clearly labelled)", { x: M+0.4, y: 2.25, w: 5.2, h: 0.4, fontFace: HEAD, fontSize: 16, color: AMBER, bold: true });
  s.addText([
    { text: "ERP connections (SAP / Odoo / Dynamics)", options: { bullet: true, breakLine: true } },
    { text: "Logistics / weather / port signals", options: { bullet: true, breakLine: true } },
    { text: "ML model trained on a simulated history", options: { bullet: true, breakLine: true } },
    { text: "No paid APIs used", options: { bullet: true } },
  ], { x: M+0.4, y: 2.85, w: 5.2, h: 3.0, fontFace: BODY, fontSize: 14, color: TEXT, valign: "top", paraSpaceAfter: 12, lineSpacing: 19 });
  card(s, M+6.2, 2.0, 5.9, 4.0, PANEL);
  s.addShape(p.shapes.RECTANGLE, { x: M+6.2, y: 2.0, w: 0.12, h: 4.0, fill: { color: GREEN } });
  s.addText("Real & production-ready", { x: M+6.6, y: 2.25, w: 5.3, h: 0.4, fontFace: HEAD, fontSize: 16, color: GREEN, bold: true });
  s.addText([
    { text: "The full app, pipeline & multi-agent crew", options: { bullet: true, breakLine: true } },
    { text: "The connector code (point env at a real system)", options: { bullet: true, breakLine: true } },
    { text: "The ML pipeline (features → train → predict → explain)", options: { bullet: true, breakLine: true } },
    { text: "Deployed, autonomous & secured on a live VPS", options: { bullet: true } },
  ], { x: M+6.6, y: 2.85, w: 5.3, h: 3.0, fontFace: BODY, fontSize: 14, color: TEXT, valign: "top", paraSpaceAfter: 12, lineSpacing: 19 });
  pageNum(s);
}

/* 14 CONCLUSION */
{
  const s = slide();
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.22, fill: { color: PRIMARY } });
  s.addText("Key takeaway", { x: M, y: 1.7, w: 10, h: 0.5, fontFace: BODY, fontSize: 15, color: PRIMARY, charSpacing: 3, bold: true });
  s.addText("Agentic AI turns fragmented supply-chain data into proactive, quantified decisions.",
    { x: M, y: 2.2, w: 11.8, h: 1.8, fontFace: HEAD, fontSize: 34, color: TEXT, bold: true, lineSpacing: 40 });
  s.addText("We built, deployed and secured a working prototype that does exactly that — for Titan Manufacturing’s supply chain.",
    { x: M, y: 4.25, w: 11.5, h: 0.8, fontFace: BODY, fontSize: 16, color: MUTED });
  s.addText([{ text: "agenticai.srv1487908.hstgr.cloud", options: { color: PRIMARYL, bold: true } },
    { text: "      github.com/cmiebach/agentic_ai", options: { color: MUTED } }],
    { x: M, y: 5.5, w: 12, h: 0.4, fontFace: BODY, fontSize: 14 });
}

p.writeFile({ fileName: "/tmp/deck/Supply_Chain_Risk_Console.pptx" }).then(f => console.log("WROTE", f));
