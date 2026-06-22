"""
Control Tower — a 4-agent CrewAI crew using NATIVE tool-calling over fragmented,
multi-source mock data, with a deliberately planted "hidden insight": two Tier-1
suppliers secretly depend on the SAME Tier-2 alloy mill (concentration risk that
no single data source reveals — the agents must connect EDI + emails + spreadsheet).

Credit: the planted-insight demo device and the 4-agent split are adapted from
teammate Ricardo Lievano's build (github.com/ricardo-lievano-pedroza/supply-chain-agents).
Here it runs inside the deployed app on kimi-k2.7-code (tool-calling, no Gemini
quota wall), with a Gemini 2.5-flash fallback.
"""

import json
import os
import re

from crewai import Agent, Task, Crew, Process, LLM

try:
    from crewai.tools import tool
except Exception:  # older crewai
    from crewai_tools import tool

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "")
# Control Tower uses glm-5.1, not kimi-k2.7-code: kimi is a code model and
# hallucinates fictional ops data in the final multi-agent synthesis. glm is a
# general model that stays faithful to the tool data (and also does tool-calling).
CT_MODEL = os.environ.get("CONTROL_TOWER_MODEL", "ollama_chat/glm-5.1:cloud")

GROUNDING = (
    " GROUNDING RULE (critical): use ONLY data returned by your tools and by the "
    "previous agents. NEVER invent supplier names, parts, locations, quantities, "
    "buffers or dollar figures — quote the EXACT values from the tools."
)

# ── Fragmented mock data (the "hidden" insight lives ACROSS these sources) ────
EDI_SHIPMENTS = [
    {"shipment_id": "SHP-1001", "tier1_supplier": "ACME Bearings", "part": "CNC spindle bearings",
     "part_id": "BRG-220", "qty": 500, "promised_eta_days": 3, "status_signal": "port_congestion", "carrier": "OceanLink"},
    {"shipment_id": "SHP-1002", "tier1_supplier": "Pacific Hydraulics", "part": "Hydraulic actuators",
     "part_id": "ACT-540", "qty": 120, "promised_eta_days": 6, "status_signal": "on_track", "carrier": "RoadFreight"},
    {"shipment_id": "SHP-1003", "tier1_supplier": "Delta Electronics", "part": "PLC control modules",
     "part_id": "PLC-77", "qty": 60, "promised_eta_days": 4, "status_signal": "supplier_reported_delay", "carrier": "AirCargo"},
]
SUPPLIER_EMAILS = [
    {"from": "logistics@delta-electronics.com", "subject": "Re: PO-88421 PLC modules",
     "body": "Heads up - we are seeing a ~5 day slip on PLC-77 modules. Our chip supplier "
             "(Shenzhen MicroChips) had a line outage. We will confirm a firm date Friday."},
    {"from": "ops@acme-bearings.com", "subject": "Alloy supply note",
     "body": "FYI our raw alloy comes from Nippon Steel Alloys. They flagged reduced output "
             "this month due to an energy curtailment."},
]
SUPPLIER_SPREADSHEET = [  # Tier-1 -> Tier-2 map: ACME and Pacific BOTH rely on Nippon Steel Alloys
    {"tier1_supplier": "ACME Bearings", "tier2_supplier": "Nippon Steel Alloys", "raw_input": "bearing-grade steel alloy"},
    {"tier1_supplier": "Pacific Hydraulics", "tier2_supplier": "Nippon Steel Alloys", "raw_input": "high-pressure steel alloy"},
    {"tier1_supplier": "Delta Electronics", "tier2_supplier": "Shenzhen MicroChips", "raw_input": "microcontroller chips"},
]
PLANT_BUFFERS = [
    {"part_id": "BRG-220", "days_of_buffer": 2, "line": "CNC machining line", "downtime_cost_per_day_usd": 180000},
    {"part_id": "ACT-540", "days_of_buffer": 9, "line": "Assembly line B", "downtime_cost_per_day_usd": 45000},
    {"part_id": "PLC-77", "days_of_buffer": 3, "line": "Robotics cell 4", "downtime_cost_per_day_usd": 90000},
]
ALTERNATE_SUPPLIERS = [
    {"part_id": "BRG-220", "alt_supplier": "EuroBear GmbH", "lead_time_days": 5, "price_premium_pct": 12, "qualified": True},
    {"part_id": "PLC-77", "alt_supplier": "NorthBridge Controls", "lead_time_days": 7, "price_premium_pct": 20, "qualified": True},
]


# ── Tools (the agents decide which to call) ──────────────────────────────────
# NB: each tool takes a dummy `query` arg. The tools need no input, but some
# models emit malformed/empty tool input for no-arg tools, which makes CrewAI
# error and retry ("Action Input is not a valid key, value dictionary"). A single
# optional string arg gives the model a valid input shape and avoids the retries.
@tool("Read EDI shipment feed")
def read_edi_feed(query: str = "") -> str:
    """Return structured in-transit shipment records with promised ETAs and risk signals. (No input needed.)"""
    return json.dumps(EDI_SHIPMENTS, indent=2)


@tool("Read supplier emails")
def read_supplier_emails(query: str = "") -> str:
    """Return unstructured supplier email text that may contain delay/outage warnings. (No input needed.)"""
    return json.dumps(SUPPLIER_EMAILS, indent=2)


@tool("Read supplier spreadsheet")
def read_supplier_spreadsheet(query: str = "") -> str:
    """Return the Tier-1 -> Tier-2 dependency map exported from a spreadsheet. (No input needed.)"""
    return json.dumps(SUPPLIER_SPREADSHEET, indent=2)


@tool("Read plant inventory buffers")
def read_plant_buffers(query: str = "") -> str:
    """Return days-of-buffer per part and the per-day cost of a line stoppage. (No input needed.)"""
    return json.dumps(PLANT_BUFFERS, indent=2)


@tool("List qualified alternate suppliers")
def read_alternate_suppliers(query: str = "") -> str:
    """Return pre-qualified backup suppliers with lead time and price premium. (No input needed.)"""
    return json.dumps(ALTERNATE_SUPPLIERS, indent=2)


def _ct_crew(llm: LLM) -> Crew:
    aggregator = Agent(
        role="Supply Chain Data Aggregator",
        goal="Unify TMC's fragmented logistics data (EDI feed, supplier emails, spreadsheet) "
             "into one clean view of every in-transit shipment and its supplier.",
        backstory="You are a meticulous data-integration specialist. You never invent data; "
                  "you only consolidate what the tools return, and you read ALL of it." + GROUNDING,
        tools=[read_edi_feed, read_supplier_emails, read_supplier_spreadsheet],
        llm=llm, verbose=True, allow_delegation=False, max_iter=5,
    )
    tier2 = Agent(
        role="Multi-Tier Risk Analyst",
        goal="Expose risk hiding below Tier-1: map Tier-2 dependencies and flag concentration "
             "risk where multiple Tier-1 suppliers rely on the same Tier-2 source.",
        backstory="You map n-tier supply networks. The most expensive surprises come from a "
                  "shared upstream supplier nobody was watching. You connect email mentions of "
                  "raw materials to the dependency map." + GROUNDING,
        tools=[read_supplier_spreadsheet, read_supplier_emails],
        llm=llm, verbose=True, allow_delegation=False, max_iter=5,
    )
    forecaster = Agent(
        role="Disruption Forecaster",
        goal="Predict which shipments will cause a line stoppage by comparing ETA risk against "
             "the days-of-buffer at the plant, and quantify the financial exposure.",
        backstory="You turn weak signals (port congestion, supplier emails, reduced upstream "
                  "output) into a ranked, dollar-quantified list of what breaks first." + GROUNDING,
        tools=[read_edi_feed, read_plant_buffers],
        llm=llm, verbose=True, allow_delegation=False, max_iter=5,
    )
    planner = Agent(
        role="Mitigation & Procurement Planner",
        goal="For each high-risk shipment recommend the best action (reroute / alternate-source / "
             "expedite) and justify expedite-vs-wait in dollar terms.",
        backstory="You are a pragmatic procurement strategist. You weigh premium cost against the "
                  "downtime cost it avoids and never expedite unless the math demands it." + GROUNDING,
        tools=[read_alternate_suppliers, read_plant_buffers],
        llm=llm, verbose=True, allow_delegation=False, max_iter=5,
    )

    t1 = Task(description="Use your tools to read the EDI feed, supplier emails and the supplier "
              "spreadsheet. Produce one consolidated table of every in-transit shipment "
              "(shipment_id, Tier-1 supplier, part, qty, promised ETA, and any risk signal — "
              "including signals only mentioned in emails), noting which source each signal came from.",
              expected_output="A consolidated shipment list with ETAs and risk signals + the source of each signal.",
              agent=aggregator)
    t2 = Task(description="Map each Tier-1 supplier to its Tier-2 source. List ONLY the exact "
              "Tier-1 → Tier-2 rows returned by the 'Read supplier spreadsheet' tool — do NOT add, "
              "rename or invent any supplier that is not in that tool's output. Then FLAG any Tier-2 "
              "that more than one Tier-1 relies on (concentration risk), and call out any Tier-2 with "
              "a reported outage/reduced output found in the supplier emails.",
              expected_output="A Tier-2 risk briefing: the dependency map, the named concentration "
              "risk (Tier-2 supplier + the exposed Tier-1 suppliers), and which Tier-2s have a warning.",
              agent=tier2, context=[t1])
    t3 = Task(description="Combine the shipment view + Tier-2 briefing with the plant inventory "
              "buffers. For each at-risk shipment decide whether the likely delay exceeds the "
              "days-of-buffer, rank by stoppage risk, and compute the $/day downtime exposure for any that breach.",
              expected_output="A ranked risk list: part, buffer days, estimated delay, breaches buffer "
              "(YES/NO), $/day exposure if it does, and the single most urgent item.",
              agent=forecaster, context=[t1, t2])
    t4 = Task(description="For each shipment that breaches buffer, propose the best mitigation using "
              "the qualified alternate suppliers and downtime costs. Compare any premium against the "
              "downtime cost avoided and recommend the cheaper path. Finish with an executive brief. "
              "Use ONLY the suppliers, parts, buffers and dollar figures from the tools and the prior "
              "agents — do not invent any names or numbers." + GROUNDING,
              expected_output="Executive brief (markdown): (1) top risks in one paragraph; (2) a "
              "recommended action per high-risk part with the $ rationale; (3) ONE structural fix for "
              "the root cause — it MUST name the specific shared Tier-2 supplier and the exact Tier-1 "
              "suppliers exposed to it, as reported by the Multi-Tier Risk Analyst.",
              agent=planner, context=[t1, t2, t3])

    return Crew(agents=[aggregator, tier2, forecaster, planner],
                tasks=[t1, t2, t3, t4], process=Process.sequential, verbose=True)


def _clean(raw: str) -> str:
    raw = (raw or "").strip()
    return re.sub(r"^\s*(?:Thought:|My final answer[^\n]*)\n+", "", raw, count=1).strip()


def run_control_tower() -> dict:
    """Run the 4-agent tool-calling crew. glm-5.1 (tool-capable, faithful, no quota)
    → Gemini 2.5-flash fallback."""
    engines = []
    if OLLAMA_BASE_URL:
        engines.append((CT_MODEL.split("/")[-1],
                        lambda: LLM(model=CT_MODEL, base_url=OLLAMA_BASE_URL, temperature=0.2, num_retries=2)))
    # NB: gemini-2.5-flash (NOT flash-lite) — flash-lite can't do tool-calling.
    engines.append(("Gemini 2.5-flash", lambda: LLM(model="gemini/gemini-2.5-flash", temperature=0.2, num_retries=0)))

    errors = []
    for i, (name, build) in enumerate(engines):
        try:
            raw = _clean(_ct_crew(build()).kickoff().raw)
            label = f"{name} · 4 agents, native tool-calling"
            return {"result": raw, "backend": label if i == 0 else label + " — fallback"}
        except Exception as exc:
            errors.append(f"{name}: {type(exc).__name__}")
    raise RuntimeError("Control Tower failed → " + "; ".join(errors))


def ct_source() -> dict:
    """Normalised workspace view of the fragmented data (EDI shipments table) for the UI."""
    cols = ["shipment_id", "tier1_supplier", "part", "qty", "eta (days)", "risk signal", "carrier"]
    rows = [[s["shipment_id"], s["tier1_supplier"], s["part"], s["qty"], s["promised_eta_days"],
             s["status_signal"], s["carrier"]] for s in EDI_SHIPMENTS]
    summary = {
        "in_transit_shipments": len(EDI_SHIPMENTS),
        "tier1_suppliers": len({s["tier1_supplier"] for s in EDI_SHIPMENTS}),
        "data_sources": "EDI · emails · spreadsheet",
        "hidden_risk": "Tier-2 concentration",
    }
    return {"source": "control_tower", "label": "Control Tower — fragmented multi-source feed",
            "seed": None, "summary": summary, "table": {"columns": cols, "rows": rows},
            "suppliers": None, "text": "Control Tower agentic demo (agents read sources via tools)."}
