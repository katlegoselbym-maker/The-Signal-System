import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0A0B",
  surface: "#131314",
  surfaceLow: "#1c1b1c",
  surfaceMid: "#201f20",
  surfaceHigh: "#2a2a2b",
  surfaceTop: "#353436",
  gold: "#f2ca50",
  goldDark: "#d4af37",
  goldGlow: "rgba(242,202,80,0.10)",
  goldBorder: "rgba(242,202,80,0.25)",
  text: "#e5e2e3",
  textMid: "#d0c5af",
  textDim: "#99907c",
  border: "rgba(255,255,255,0.09)",
  borderLight: "rgba(255,255,255,0.05)",
  glass: "rgba(255,255,255,0.035)",
  green: "#4ade80",
  red: "#f87171",
};

const MONO = "'JetBrains Mono', 'Courier New', monospace";
const BODY = "'Inter', system-ui, sans-serif";

// ─── Data ─────────────────────────────────────────────────────────────────────
const INQUIRIES = [
  { id: "portal", label: "Portal Lead", sub: "Came in at 11pm from Zillow or Realtor.com", badge: "IMMEDIATE" },
  { id: "open-house", label: "Open House Visitor", sub: "Said nice house and left their number", badge: "WARM" },
  { id: "fsbo", label: "FSBO Owner", sub: "Selling themselves and found you online", badge: "MOTIVATED" },
  { id: "expired", label: "Expired Listing", sub: "Listing just expired, still needs to sell", badge: "URGENT" },
  { id: "relocation", label: "Relocation Buyer", sub: "Moving from another state to your market", badge: "SERIOUS" },
  { id: "investor", label: "Investor Inquiry", sub: "Looking for investment property or fix and flip", badge: "HIGH VALUE" },
  { id: "cold-seller", label: "Cold Seller Inquiry", sub: "Wants to know what their home is worth", badge: "CURIOUS" },
  { id: "first-buyer", label: "First Time Buyer", sub: "Never bought before, overwhelmed by the process", badge: "NURTURE" },
  { id: "referral", label: "Warm Referral", sub: "Someone they trust sent them specifically to you", badge: "PRIORITY" },
  { id: "social-dm", label: "Social Media DM", sub: "Found you on Instagram or Facebook and messaged", badge: "FRESH" },
  { id: "past-client", label: "Past Client Return", sub: "Previous buyer or seller coming back to you", badge: "VIP" },
  { id: "browsing", label: "Just Browsing", sub: "Not serious yet, still gathering information", badge: "PATIENCE" },
];

const SCENARIOS = [
  { id: "week1", label: "Week 1. Zero Showings", level: "HIGH" },
  { id: "week3", label: "Week 3. Showings But No Offers", level: "HIGH" },
  { id: "price-cut", label: "The Price Reduction Conversation", level: "CRITICAL" },
  { id: "panic", label: "The Seller Panic Call", level: "CRITICAL" },
  { id: "leaving", label: "Thinking of Going Elsewhere", level: "CRITICAL" },
  { id: "pull-off", label: "Should We Pull It Off Market", level: "HIGH" },
  { id: "confidence", label: "Seller Losing Confidence in You", level: "CRITICAL" },
];

const CONTENT_IDEAS = [
  "The one invisible reason your listing is getting ignored",
  "What buyers actually decide in the first 8 seconds of reading",
  "Why following up 3 times and stopping is the most expensive habit in real estate",
  "The seller question that reveals everything about your market position",
  "What a $10 million listing caption and a $200k listing caption have in common",
  "The follow-up message your competition is too afraid to send",
];

// ─── API ──────────────────────────────────────────────────────────────────────
async function callClaude(system, user) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ─── Copy Hook ────────────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return [copied, copy];
}

// ─── Sub Components ───────────────────────────────────────────────────────────
function MonoTag({ children, color = T.gold, bg, border }) {
  return (
    <span style={{
      fontFamily: MONO, fontSize: "9px", letterSpacing: "0.18em",
      color: color || T.gold,
      background: bg || "rgba(242,202,80,0.08)",
      border: `1px solid ${border || "rgba(242,202,80,0.2)"}`,
      borderRadius: "4px", padding: "3px 9px",
    }}>{children}</span>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "16px", padding: "48px" }}>
      <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "28px" }}>
        {[0.0, 0.15, 0.3, 0.15, 0.0].map((d, i) => (
          <div key={i} style={{
            width: "4px", borderRadius: "2px", background: T.gold,
            animation: "wave 0.9s ease-in-out infinite alternate",
            animationDelay: `${d}s`, minHeight: "6px",
          }} />
        ))}
      </div>
      <span style={{ fontFamily: MONO, fontSize: "10px", color: T.textDim, letterSpacing: "0.12em" }}>GENERATING...</span>
    </div>
  );
}

function CopyBtn({ onCopy, copied, label = "COPY" }) {
  return (
    <button
      onClick={onCopy}
      style={{
        background: copied ? "rgba(74,222,128,0.1)" : T.gold,
        color: copied ? T.green : T.bg,
        border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "transparent"}`,
        borderRadius: "6px", padding: "10px 22px",
        fontFamily: MONO, fontSize: "10px", fontWeight: "700",
        letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.2s",
      }}
    >{copied ? "✓ COPIED" : label}</button>
  );
}

function RegenerateBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: `1px solid ${T.border}`,
      borderRadius: "6px", padding: "10px 16px",
      fontFamily: MONO, fontSize: "10px", color: T.textDim,
      letterSpacing: "0.08em", cursor: "pointer",
    }}>REGENERATE</button>
  );
}

// ─── INTEL TAB ────────────────────────────────────────────────────────────────
function Intel({ voiceProfile, onNavigate }) {
  const steps = [
    {
      num: "01", tab: "signals",
      label: "Extract Your Voice Signal",
      desc: "Paste your existing content. The system reads how you communicate and builds your profile.",
      done: !!voiceProfile,
    },
    {
      num: "02", tab: "targets",
      label: "Generate Your Response Library",
      desc: "12 first-response messages for 12 inquiry types. All built from your voice.",
      done: false,
    },
    {
      num: "03", tab: "archive",
      label: "Build Your Seller Scripts",
      desc: "7 scripts for the 7 conversations that cost agents their listings.",
      done: false,
    },
    {
      num: "04", tab: "archive",
      label: "Deploy Your Content Engine",
      desc: "Generate social content that sounds like you, not like a Canva template.",
      done: false,
    },
  ];

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} className="pulse" />
          <span style={{ fontFamily: MONO, fontSize: "9px", color: T.green, letterSpacing: "0.22em" }}>ACTIVE EXTRACTION PROTOCOL</span>
        </div>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: "800", lineHeight: "1.1", letterSpacing: "-0.025em", marginBottom: "20px", color: T.text }}>
          COMMAND CENTER
          <br /><span style={{ color: T.gold }}>AGENT VOICE 01</span>
        </h1>
        <p style={{ fontSize: "15px", color: T.textMid, maxWidth: "540px", lineHeight: "1.85" }}>
          Your communication DNA is the foundation of every output this system builds. The responses, the scripts, the content — all of it starts from how you already sound at your best.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginBottom: "44px" }}>
        {[
          { label: "INQUIRY TYPES", value: "12" },
          { label: "SELLER SCRIPTS", value: "7" },
          { label: "CONTENT ENGINE", value: "30 DAYS" },
          { label: "DELIVERY TIME", value: "14 DAYS" },
        ].map(s => (
          <div key={s.label} style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px 16px" }}>
            <div style={{ fontFamily: MONO, fontSize: "8px", color: T.textDim, letterSpacing: "0.14em", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: "26px", fontWeight: "700", color: T.gold }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.18em", marginBottom: "16px" }}>DEPLOYMENT SEQUENCE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {steps.map((step) => (
            <div
              key={step.num}
              onClick={() => onNavigate(step.tab)}
              style={{
                background: step.done ? "rgba(74,222,128,0.04)" : T.glass,
                border: `1px solid ${step.done ? "rgba(74,222,128,0.18)" : T.border}`,
                borderLeft: `3px solid ${step.done ? T.green : T.gold}`,
                borderRadius: "8px", padding: "18px 22px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", transition: "all 0.15s",
              }}
              className="card-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                  background: step.done ? T.green : T.goldGlow,
                  border: `1px solid ${step.done ? T.green : T.goldBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: MONO, fontSize: "11px", fontWeight: "700",
                  color: step.done ? T.bg : T.gold,
                }}>{step.done ? "✓" : step.num}</div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: T.text, marginBottom: "2px" }}>{step.label}</div>
                  <div style={{ fontFamily: MONO, fontSize: "10px", color: T.textDim }}>{step.desc}</div>
                </div>
              </div>
              <span style={{ color: T.textDim, fontSize: "20px", flexShrink: 0 }}>›</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, rgba(242,202,80,0.05) 0%, rgba(0,0,0,0) 100%)`, border: `1px solid ${T.goldBorder}`, borderRadius: "8px", padding: "32px" }}>
        <div style={{ fontFamily: MONO, fontSize: "9px", color: T.gold, letterSpacing: "0.18em", marginBottom: "14px" }}>THE CORE DIAGNOSIS</div>
        <p style={{ fontSize: "17px", fontStyle: "italic", color: T.text, lineHeight: "1.9", marginBottom: "20px" }}>
          "Most agents think they have a lead problem. They do not. They have a communication problem. Leads do not disappear randomly. Trust erodes sentence by sentence. And the agent never sees it happen because the lead simply vanishes without a word."
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {[
            "95% of agents lose deals from not knowing what to say",
            "46% say AI tools have had zero real impact on their business",
            "48% never follow up after the first attempt",
          ].map((stat, i) => (
            <MonoTag key={i} color={T.textDim} bg={T.surfaceMid} border={T.border}>{stat}</MonoTag>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SIGNALS TAB ──────────────────────────────────────────────────────────────
function Signals({ content, setContent, voiceProfile, extracting, error, onExtract }) {
  return (
    <div className="fade-up">
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.gold }} className="pulse" />
          <span style={{ fontFamily: MONO, fontSize: "9px", color: T.gold, letterSpacing: "0.22em" }}>LIVE SIGNAL EXTRACTION</span>
        </div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "10px" }}>Voice Signal Profile</h2>
        <p style={{ fontSize: "14px", color: T.textMid, maxWidth: "520px", lineHeight: "1.85" }}>
          Paste any content you have written as an agent. Listings, emails, social captions, texts. The more you give it, the more accurate your profile becomes.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: voiceProfile ? "1fr 1fr" : "1fr", gap: "20px", marginBottom: "24px" }}>
        <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "13px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.14em" }}>INPUT CONTENT</span>
            <span style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim }}>{content.length} CHARS</span>
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Paste your listing descriptions, client emails, social captions, or any content you have written as an agent. Mix it up for the best extraction result."
            style={{
              width: "100%", minHeight: "280px", background: "transparent", border: "none",
              color: T.text, fontFamily: BODY, fontSize: "14px", lineHeight: "1.75",
              padding: "20px", resize: "vertical",
            }}
          />
          {error && (
            <div style={{ padding: "11px 20px", background: "rgba(248,113,113,0.05)", borderTop: "1px solid rgba(248,113,113,0.15)" }}>
              <span style={{ fontFamily: MONO, fontSize: "9px", color: T.red }}>{error}</span>
            </div>
          )}
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}` }}>
            <button
              onClick={onExtract}
              disabled={extracting}
              className={!extracting ? "btn-primary" : ""}
              style={{
                background: extracting ? T.surfaceHigh : T.gold,
                color: extracting ? T.textDim : T.bg,
                border: "none", borderRadius: "6px", padding: "12px 24px",
                fontFamily: MONO, fontSize: "11px", fontWeight: "700",
                letterSpacing: "0.1em", cursor: extracting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                boxShadow: extracting ? "none" : "0 0 24px rgba(242,202,80,0.2)",
                transition: "all 0.2s",
              }}
            >
              {extracting ? (
                <><span style={{ animation: "pulse 1s infinite", display: "inline-block" }}>◈</span> EXTRACTING SIGNAL...</>
              ) : "EXTRACT VOICE SIGNAL →"}
            </button>
          </div>
        </div>

        {voiceProfile && (
          <div className="fade-up" style={{ background: T.glass, border: `1px solid ${T.goldBorder}`, borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "13px 20px", borderBottom: `1px solid ${T.goldBorder}`, background: T.goldGlow, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: MONO, fontSize: "9px", color: T.gold, letterSpacing: "0.14em" }}>PROFILE ACTIVE</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.green }} className="pulse" />
                <span style={{ fontFamily: MONO, fontSize: "9px", color: T.green }}>SYNC COMPLETE</span>
              </div>
            </div>
            <div style={{ padding: "22px", maxHeight: "420px", overflowY: "auto" }}>
              {voiceProfile.summary && (
                <div style={{ marginBottom: "18px", padding: "14px", background: T.surfaceMid, borderRadius: "6px", borderLeft: `3px solid ${T.gold}` }}>
                  <div style={{ fontFamily: MONO, fontSize: "8px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "6px" }}>PROFILE SUMMARY</div>
                  <p style={{ fontSize: "13px", color: T.text, lineHeight: "1.7" }}>{voiceProfile.summary}</p>
                </div>
              )}
              {[
                { key: "tone", label: "TONE" },
                { key: "authority_style", label: "AUTHORITY STYLE" },
                { key: "sentence_rhythm", label: "SENTENCE RHYTHM" },
                { key: "emotional_register", label: "EMOTIONAL REGISTER" },
                { key: "vocabulary", label: "VOCABULARY LEVEL" },
                { key: "closing_style", label: "CLOSING STYLE" },
                { key: "market_expertise", label: "MARKET EXPERTISE" },
              ].filter(f => voiceProfile[f.key] && typeof voiceProfile[f.key] === "string").map(field => (
                <div key={field.key} style={{ marginBottom: "13px", paddingBottom: "13px", borderBottom: `1px solid ${T.borderLight}` }}>
                  <div style={{ fontFamily: MONO, fontSize: "8px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "4px" }}>{field.label}</div>
                  <div style={{ fontSize: "13px", color: T.text }}>{voiceProfile[field.key]}</div>
                </div>
              ))}
              {Array.isArray(voiceProfile.trust_signals) && voiceProfile.trust_signals.length > 0 && (
                <div style={{ marginBottom: "13px" }}>
                  <div style={{ fontFamily: MONO, fontSize: "8px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "8px" }}>TRUST SIGNALS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {voiceProfile.trust_signals.map((s, i) => (
                      <MonoTag key={i}>{s}</MonoTag>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(voiceProfile.unique_patterns) && voiceProfile.unique_patterns.length > 0 && (
                <div>
                  <div style={{ fontFamily: MONO, fontSize: "8px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "8px" }}>UNIQUE PATTERNS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {voiceProfile.unique_patterns.map((p, i) => (
                      <MonoTag key={i} color="#b1c5ff" bg="rgba(177,197,255,0.07)" border="rgba(177,197,255,0.2)">{p}</MonoTag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!voiceProfile && (
        <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "24px" }}>
          <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "16px" }}>SEMANTIC WAVEFORM ANALYSIS</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "48px", marginBottom: "18px" }}>
            {Array.from({ length: 44 }).map((_, i) => (
              <div key={i} style={{
                flex: 1,
                background: `rgba(242,202,80,${0.06 + (i % 7) * 0.04})`,
                borderRadius: "1px 1px 0 0",
                animation: "wave 1.3s ease-in-out infinite alternate",
                animationDelay: `${(i % 8) * 0.08}s`,
                minHeight: "6px",
              }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {["RESONANCE", "VELOCITY", "CLARITY", "INTENT"].map(m => (
              <div key={m} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: "8px", color: T.textDim, marginBottom: "4px" }}>{m}</div>
                <div style={{ fontFamily: MONO, fontSize: "15px", color: T.surfaceTop }}>IDLE</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TARGETS TAB ─────────────────────────────────────────────────────────────
function Targets({ voiceProfile, selectedInquiry, responseText, loading, onSelect, onCopy, copied }) {
  return (
    <div className="fade-up">
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.gold }} className="pulse" />
          <span style={{ fontFamily: MONO, fontSize: "9px", color: T.gold, letterSpacing: "0.22em" }}>FIRST 48 RESPONSE PROTOCOL</span>
        </div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "10px" }}>Lead Response Engine</h2>
        <p style={{ fontSize: "14px", color: T.textMid, maxWidth: "520px", lineHeight: "1.85" }}>
          Select the inquiry type. The system generates a first-response message in your voice. Ready to send in under 60 seconds.
          {!voiceProfile && <> <span style={{ color: T.gold }}>Extract your Voice Profile first for best results.</span></>}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "20px" }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "14px" }}>SELECT INQUIRY TYPE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {INQUIRIES.map(inq => (
              <button
                key={inq.id}
                onClick={() => onSelect(inq)}
                className="card-hover"
                style={{
                  background: selectedInquiry?.id === inq.id ? T.goldGlow : T.glass,
                  border: `1px solid ${selectedInquiry?.id === inq.id ? T.goldBorder : T.border}`,
                  borderRadius: "8px", padding: "13px",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: "7px", color: selectedInquiry?.id === inq.id ? T.gold : T.textDim, letterSpacing: "0.12em", marginBottom: "4px" }}>{inq.badge}</div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: T.text, marginBottom: "2px" }}>{inq.label}</div>
                <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, lineHeight: "1.4" }}>{inq.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em" }}>GENERATED RESPONSE</div>
          <div style={{
            background: T.glass, border: `1px solid ${selectedInquiry ? T.goldBorder : T.border}`,
            borderRadius: "8px", overflow: "hidden", flex: 1, display: "flex", flexDirection: "column", minHeight: "320px",
          }}>
            {!selectedInquiry && !loading && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "40px" }}>
                <span style={{ fontSize: "28px", opacity: 0.25 }}>◎</span>
                <span style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, textAlign: "center", letterSpacing: "0.1em" }}>SELECT AN INQUIRY TYPE TO GENERATE A RESPONSE</span>
              </div>
            )}
            {loading && <Loader />}
            {responseText && !loading && (
              <>
                <div style={{ padding: "13px 20px", borderBottom: `1px solid ${T.border}`, background: T.goldGlow }}>
                  <span style={{ fontFamily: MONO, fontSize: "9px", color: T.gold }}>{selectedInquiry?.label?.toUpperCase()}</span>
                </div>
                <div style={{ flex: 1, padding: "24px" }}>
                  <p style={{ fontSize: "15px", color: T.text, lineHeight: "1.9", fontStyle: "italic", borderLeft: `3px solid ${T.gold}`, paddingLeft: "18px" }}>
                    {responseText}
                  </p>
                </div>
                <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: "10px" }}>
                  <CopyBtn onCopy={onCopy} copied={copied} label="COPY RESPONSE" />
                  <RegenerateBtn onClick={() => onSelect(selectedInquiry)} />
                </div>
              </>
            )}
          </div>

          <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px" }}>
            <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "14px" }}>THE FIRST 48 PROTOCOL</div>
            {[
              { stage: "01", label: "Immediate Response", desc: "Within 5 minutes of inquiry arriving", active: true },
              { stage: "02", label: "Day 3 Follow Up", desc: "Value-add touchpoint if no reply received", active: false },
              { stage: "03", label: "Day 7 Recovery", desc: "Final positioning message", active: false },
            ].map(p => (
              <div key={p.stage} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "11px" }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                  background: p.active ? T.goldGlow : T.surfaceMid,
                  border: `1px solid ${p.active ? T.goldBorder : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: MONO, fontSize: "8px", color: p.active ? T.gold : T.textDim,
                }}>{p.stage}</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: p.active ? T.text : T.textDim }}>{p.label}</div>
                  <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ARCHIVE TAB ──────────────────────────────────────────────────────────────
function Archive({ voiceProfile, selectedScenario, scriptText, loadingScript, onSelectScenario, contentIdea, setContentIdea, contentText, loadingContent, onGenerateContent, onCopy, copied }) {
  const [view, setView] = useState("scripts");

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.gold }} className="pulse" />
          <span style={{ fontFamily: MONO, fontSize: "9px", color: T.gold, letterSpacing: "0.22em" }}>KNOWLEDGE ARCHIVE</span>
        </div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "800", letterSpacing: "-0.02em" }}>Asset Library</h2>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
        {[
          { id: "scripts", label: "SELLER SCRIPTS" },
          { id: "content", label: "CONTENT ENGINE" },
          { id: "seo", label: "SEO ARSENAL" },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              background: view === v.id ? T.goldGlow : "none",
              border: `1px solid ${view === v.id ? T.goldBorder : T.border}`,
              borderRadius: "6px", padding: "8px 16px",
              fontFamily: MONO, fontSize: "10px", fontWeight: "700",
              letterSpacing: "0.1em", color: view === v.id ? T.gold : T.textDim,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >{v.label}</button>
        ))}
      </div>

      {view === "scripts" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "20px" }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "14px" }}>SELECT SCENARIO</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSelectScenario(s)}
                  className="card-hover"
                  style={{
                    background: selectedScenario?.id === s.id ? T.goldGlow : T.glass,
                    border: `1px solid ${selectedScenario?.id === s.id ? T.goldBorder : T.border}`,
                    borderLeft: `3px solid ${s.level === "CRITICAL" ? T.red : T.gold}`,
                    borderRadius: "8px", padding: "14px",
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: T.text }}>{s.label}</div>
                    <MonoTag
                      color={s.level === "CRITICAL" ? T.red : T.gold}
                      bg={s.level === "CRITICAL" ? "rgba(248,113,113,0.08)" : T.goldGlow}
                      border={s.level === "CRITICAL" ? "rgba(248,113,113,0.2)" : T.goldBorder}
                    >{s.level}</MonoTag>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "14px" }}>GENERATED SCRIPT</div>
            <div style={{ background: T.glass, border: `1px solid ${selectedScenario ? T.goldBorder : T.border}`, borderRadius: "8px", overflow: "hidden", minHeight: "460px", display: "flex", flexDirection: "column" }}>
              {!selectedScenario && !loadingScript && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "40px" }}>
                  <span style={{ fontSize: "28px", opacity: 0.25 }}>▣</span>
                  <span style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, textAlign: "center" }}>SELECT A SCENARIO TO GENERATE A SCRIPT</span>
                </div>
              )}
              {loadingScript && <Loader />}
              {scriptText && !loadingScript && (
                <>
                  <div style={{ padding: "13px 20px", borderBottom: `1px solid ${T.border}`, background: T.goldGlow }}>
                    <span style={{ fontFamily: MONO, fontSize: "9px", color: T.gold }}>{selectedScenario?.label?.toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
                    <p style={{ fontSize: "13px", color: T.text, lineHeight: "1.95", whiteSpace: "pre-line" }}>{scriptText}</p>
                  </div>
                  <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: "10px" }}>
                    <CopyBtn onCopy={() => onCopy(scriptText)} copied={copied} label="COPY SCRIPT" />
                    <RegenerateBtn onClick={() => onSelectScenario(selectedScenario)} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "content" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "20px" }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "14px" }}>CONTENT TOPIC</div>
            <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: "8px", overflow: "hidden", marginBottom: "12px" }}>
              <textarea
                value={contentIdea}
                onChange={e => setContentIdea(e.target.value)}
                placeholder="Describe your content topic or select one of the ideas below..."
                style={{
                  width: "100%", minHeight: "88px", background: "transparent", border: "none",
                  color: T.text, fontFamily: BODY, fontSize: "14px", lineHeight: "1.7", padding: "16px", resize: "none",
                }}
              />
            </div>
            <button
              onClick={onGenerateContent}
              disabled={loadingContent || !contentIdea.trim()}
              className={!loadingContent && contentIdea.trim() ? "btn-primary" : ""}
              style={{
                background: loadingContent || !contentIdea.trim() ? T.surfaceHigh : T.gold,
                color: loadingContent || !contentIdea.trim() ? T.textDim : T.bg,
                border: "none", borderRadius: "6px", padding: "12px 24px",
                fontFamily: MONO, fontSize: "11px", fontWeight: "700",
                letterSpacing: "0.1em",
                cursor: loadingContent || !contentIdea.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", marginBottom: "20px", transition: "all 0.2s",
                boxShadow: !loadingContent && contentIdea.trim() ? "0 0 20px rgba(242,202,80,0.18)" : "none",
              }}
            >{loadingContent ? "GENERATING POST..." : "GENERATE POST →"}</button>

            <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "12px" }}>TOPIC IDEAS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {CONTENT_IDEAS.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => setContentIdea(idea)}
                  className="card-hover"
                  style={{
                    background: T.glass, border: `1px solid ${T.border}`,
                    borderRadius: "6px", padding: "10px 14px",
                    cursor: "pointer", textAlign: "left",
                    fontSize: "12px", color: T.textMid, transition: "all 0.15s",
                  }}
                >{idea}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, letterSpacing: "0.15em", marginBottom: "14px" }}>GENERATED POST</div>
            <div style={{ background: T.glass, border: `1px solid ${contentText ? T.goldBorder : T.border}`, borderRadius: "8px", overflow: "hidden", minHeight: "420px", display: "flex", flexDirection: "column" }}>
              {!contentText && !loadingContent && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "40px" }}>
                  <span style={{ fontSize: "28px", opacity: 0.25 }}>⚡</span>
                  <span style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim, textAlign: "center" }}>SELECT A TOPIC AND GENERATE YOUR CONTENT</span>
                </div>
              )}
              {loadingContent && <Loader />}
              {contentText && !loadingContent && (
                <>
                  <div style={{ padding: "13px 20px", borderBottom: `1px solid ${T.border}`, background: T.goldGlow }}>
                    <span style={{ fontFamily: MONO, fontSize: "9px", color: T.gold }}>READY TO POST</span>
                  </div>
                  <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
                    <p style={{ fontSize: "14px", color: T.text, lineHeight: "1.95", whiteSpace: "pre-line" }}>{contentText}</p>
                  </div>
                  <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: "10px" }}>
                    <CopyBtn onCopy={() => onCopy(contentText)} copied={copied} label="COPY POST" />
                    <RegenerateBtn onClick={onGenerateContent} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "seo" && (
        <div>
          {[
            {
              tier: "PRIMARY KEYWORDS", color: T.gold, border: T.goldBorder, bg: T.goldGlow,
              desc: "Use in product titles, sales page headlines, and marketplace listings.",
              words: [
                "real estate agent AI communication system",
                "done for you real estate marketing system",
                "real estate listing copy that converts",
                "AI real estate lead conversion 2026",
                "real estate agent voice AI system",
              ],
            },
            {
              tier: "SECONDARY KEYWORDS", color: "#b1c5ff", border: "rgba(177,197,255,0.25)", bg: "rgba(177,197,255,0.07)",
              desc: "Use in product descriptions, subheadings, and marketplace tags.",
              words: [
                "real estate seller communication scripts",
                "real estate lead follow up system that works",
                "real estate content that generates leads",
                "real estate agent conversion system",
                "real estate follow up scripts",
                "why real estate leads go cold",
                "real estate agent AI tools 2026",
              ],
            },
            {
              tier: "LONG TAIL KEYWORDS", color: T.green, border: "rgba(74,222,128,0.25)", bg: "rgba(74,222,128,0.07)",
              desc: "Use in blog content, YouTube titles, and Etsy product descriptions.",
              words: [
                "why my real estate listings are not getting inquiries",
                "real estate follow up messages that get replies",
                "how to sound confident talking to sellers",
                "real estate AI that sounds like you not a robot",
                "done for you real estate content system",
                "how to recover a cold real estate lead",
              ],
            },
          ].map(tier => (
            <div key={tier.tier} style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: MONO, fontSize: "9px", color: tier.color, letterSpacing: "0.18em" }}>{tier.tier}</span>
                <span style={{ fontFamily: MONO, fontSize: "9px", color: T.textDim }}>{tier.desc}</span>
              </div>
              <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "18px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {tier.words.map((w, i) => (
                    <MonoTag key={i} color={tier.color} bg={tier.bg} border={tier.border}>{w}</MonoTag>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div style={{ background: T.glass, border: `1px solid ${T.goldBorder}`, borderRadius: "8px", padding: "24px", marginTop: "8px" }}>
            <div style={{ fontFamily: MONO, fontSize: "9px", color: T.gold, letterSpacing: "0.15em", marginBottom: "16px" }}>PLATFORM DEPLOYMENT MAP</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
              {[
                { platform: "Payhip", price: "$497", role: "Primary Store" },
                { platform: "Gumroad", price: "$497", role: "Secondary Store" },
                { platform: "Whop", price: "$697", role: "Premium Community" },
                { platform: "Etsy", price: "$37", role: "Trust Bridge Entry" },
                { platform: "Udemy", price: "$197", role: "Methodology Course" },
                { platform: "Ko-fi", price: "$37", role: "Starter Kit" },
                { platform: "ClickBank", price: "$47", role: "Affiliate Entry" },
              ].map(p => (
                <div key={p.platform} style={{ background: T.surfaceMid, border: `1px solid ${T.border}`, borderRadius: "6px", padding: "12px" }}>
                  <div style={{ fontFamily: MONO, fontSize: "11px", fontWeight: "700", color: T.gold, marginBottom: "4px" }}>{p.platform}</div>
                  <div style={{ fontFamily: MONO, fontSize: "18px", fontWeight: "700", color: T.text, marginBottom: "2px" }}>{p.price}</div>
                  <div style={{ fontFamily: MONO, fontSize: "8px", color: T.textDim }}>{p.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function SignalSystem() {
  const [tab, setTab] = useState("intel");
  const [voiceProfile, setVoiceProfile] = useState(null);
  const [agentContent, setAgentContent] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [generatingResponse, setGeneratingResponse] = useState(false);

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scriptText, setScriptText] = useState("");
  const [generatingScript, setGeneratingScript] = useState(false);

  const [contentIdea, setContentIdea] = useState("");
  const [contentText, setContentText] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);

  const [copied, copy] = useCopy();

  const extractVoice = async () => {
    if (agentContent.trim().length < 80) {
      setExtractError("Paste at least a few sentences of your real content to extract a meaningful Voice Profile.");
      return;
    }
    setExtracting(true);
    setExtractError("");
    try {
      const result = await callClaude(
        `You are a communication intelligence analyst. Analyze real estate agent content and extract their unique communication DNA.

Return ONLY valid JSON. No preamble, no markdown, no explanation. Just the raw JSON object.

{
  "tone": "2 to 3 word description",
  "authority_style": "how they establish credibility in one sentence",
  "sentence_rhythm": "short and punchy OR long and flowing OR mixed",
  "trust_signals": ["phrase1", "phrase2", "phrase3"],
  "emotional_register": "warm OR analytical OR confident OR calm OR urgent",
  "closing_style": "how they naturally end conversations in one sentence",
  "vocabulary": "casual OR professional OR technical",
  "unique_patterns": ["pattern1", "pattern2"],
  "market_expertise": "what specific market knowledge they demonstrate",
  "summary": "one sentence describing their full communication style"
}`,
        `Analyze this real estate agent content and extract their Voice Signal Profile:\n\n${agentContent}`
      );
      try {
        const cleaned = result.replace(/```json|```/g, "").trim();
        setVoiceProfile(JSON.parse(cleaned));
      } catch {
        setVoiceProfile({ summary: result, raw: true });
      }
    } catch {
      setExtractError("Extraction failed. Check your connection and try again.");
    }
    setExtracting(false);
  };

  const generateResponse = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseText("");
    setGeneratingResponse(true);
    const profileCtx = voiceProfile
      ? `Voice Profile: ${voiceProfile.summary}. Tone: ${voiceProfile.tone}. Rhythm: ${voiceProfile.sentence_rhythm}. Register: ${voiceProfile.emotional_register}. Closing Style: ${voiceProfile.closing_style}.`
      : "Write in a warm, confident, conversational style. Like a trusted local expert talking to a neighbor. Not corporate.";
    try {
      const result = await callClaude(
        `You write first-response messages for real estate agents. Every message must sound completely human and specific.

HARD RULES:
Under 80 words.
No generic openers. No "Hope this finds you well." No "Just checking in." No "I would love to help."
No AI language. No buzzwords.
Ends with ONE specific low-friction question that opens a conversation.
Does not try to close a transaction.
No dashes anywhere in the message.
No bullet points.
Sounds like the agent wrote it fast between two appointments, not like software generated it.

${profileCtx}`,
        `Write a first-response message for this real estate inquiry:\n\nType: ${inquiry.label}\nContext: ${inquiry.sub}`
      );
      setResponseText(result.trim());
    } catch {
      setResponseText("Generation failed. Try again.");
    }
    setGeneratingResponse(false);
  };

  const generateScript = async (scenario) => {
    setSelectedScenario(scenario);
    setScriptText("");
    setGeneratingScript(true);
    const profileCtx = voiceProfile
      ? `Mirror this communication style exactly: ${voiceProfile.summary}. Tone: ${voiceProfile.tone}. Register: ${voiceProfile.emotional_register}.`
      : "Write in a confident, warm, direct style. Authoritative but human.";
    try {
      const result = await callClaude(
        `You write seller communication scripts for real estate agents. These scripts must sound like the agent wrote them on their most confident and clear day.

HARD RULES:
200 to 300 words.
Include brief tone notes in parentheses, e.g. (pause here), (warm but direct).
No generic phrases like "the market is challenging" or "I completely understand your frustration."
No corporate language. No dashes.
Addresses the scenario head-on without false promises.
Ends with a clear, confident next step.
Written as dialogue the agent will speak, not read.
Sounds completely natural when spoken aloud.

${profileCtx}`,
        `Write a complete seller communication script for this scenario:\n\n${scenario.label}`
      );
      setScriptText(result.trim());
    } catch {
      setScriptText("Generation failed. Try again.");
    }
    setGeneratingScript(false);
  };

  const generateContent = async () => {
    if (!contentIdea.trim()) return;
    setContentText("");
    setGeneratingContent(true);
    const profileCtx = voiceProfile
      ? `Write in this exact style: ${voiceProfile.summary}. Vocabulary: ${voiceProfile.vocabulary}. Rhythm: ${voiceProfile.sentence_rhythm}.`
      : "Write conversationally. Short paragraphs. Real specific insight. Not generic advice.";
    try {
      const result = await callClaude(
        `You write social media content for real estate agents. Every post must stop the scroll and sound 100 percent human.

HARD RULES:
Under 150 words.
First line is a scroll-stopping statement. Not a question. Not "Did you know."
Contains ONE specific real insight, not generic advice.
Short paragraphs, maximum 2 sentences each.
Phone readable with single line breaks between paragraphs.
No AI words: leverage, ecosystem, game-changer, journey, empower, unlock, elevate, utilize, seamless, robust.
No dashes anywhere.
No bullet points in the body.
Ends with a direct low-friction CTA.
Suggested hashtags on the very last line only, separated by one blank line.

${profileCtx}`,
        `Write a social media post about this topic for a real estate agent:\n\n${contentIdea}`
      );
      setContentText(result.trim());
    } catch {
      setContentText("Generation failed. Try again.");
    }
    setGeneratingContent(false);
  };

  const TABS = [
    { id: "intel", label: "INTEL", icon: "◈" },
    { id: "signals", label: "SIGNALS", icon: "⚡" },
    { id: "targets", label: "TARGETS", icon: "◎" },
    { id: "archive", label: "ARCHIVE", icon: "▣" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: BODY, color: T.text, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea, input, button { font-family: inherit; }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.surfaceTop}; border-radius: 2px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes wave { 0%{height:12%} 100%{height:100%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .pulse { animation: pulse 2.2s infinite ease-in-out; }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .btn-primary { transition: all 0.2s !important; }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0px); }
        .card-hover { transition: all 0.15s !important; }
        .card-hover:hover { border-color: rgba(242,202,80,0.3) !important; background: rgba(255,255,255,0.06) !important; }
        .tab-btn:hover { color: ${T.gold} !important; }
      `}</style>

      {/* Ambient atmosphere */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-15%", left: "25%", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(242,202,80,0.03) 0%, transparent 65%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(177,197,255,0.02) 0%, transparent 65%)", borderRadius: "50%" }} />
      </div>

      {/* Scanline */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(to right, transparent 0%, ${T.gold} 50%, transparent 100%)`,
        opacity: 0.12, pointerEvents: "none", zIndex: 200,
        animation: "wave 10s linear infinite",
      }} />

      {/* Header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "58px",
        background: "rgba(10,10,11,0.94)", backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", padding: "0 20px", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: 0 }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.gold, boxShadow: `0 0 10px rgba(242,202,80,0.6)` }} className="pulse" />
          <span style={{ fontFamily: MONO, fontSize: "12px", fontWeight: "700", color: T.gold, letterSpacing: "0.08em" }}>THE SIGNAL SYSTEM™</span>
        </div>

        <nav style={{ display: "flex", gap: "2px", flex: 1, justifyContent: "center" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="tab-btn" style={{
              background: tab === t.id ? T.goldGlow : "none",
              border: `1px solid ${tab === t.id ? T.goldBorder : "transparent"}`,
              borderRadius: "6px", padding: "6px 16px",
              fontFamily: MONO, fontSize: "10px", fontWeight: "700",
              letterSpacing: "0.1em", cursor: "pointer",
              color: tab === t.id ? T.gold : T.textDim,
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </nav>

        <div style={{
          display: "flex", alignItems: "center", gap: "7px", flexShrink: 0,
          background: voiceProfile ? "rgba(74,222,128,0.07)" : T.goldGlow,
          border: `1px solid ${voiceProfile ? "rgba(74,222,128,0.2)" : T.goldBorder}`,
          borderRadius: "99px", padding: "5px 12px",
        }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: voiceProfile ? T.green : T.gold }} className="pulse" />
          <span style={{ fontFamily: MONO, fontSize: "9px", color: voiceProfile ? T.green : T.gold, letterSpacing: "0.12em" }}>
            {voiceProfile ? "PROFILE ACTIVE" : "AWAITING SIGNAL"}
          </span>
        </div>
      </header>

      {/* Main */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: "1120px", margin: "0 auto", padding: "78px 20px 96px" }}>
        {tab === "intel" && <Intel voiceProfile={voiceProfile} onNavigate={setTab} />}
        {tab === "signals" && (
          <Signals
            content={agentContent} setContent={setAgentContent}
            voiceProfile={voiceProfile}
            extracting={extracting} error={extractError} onExtract={extractVoice}
          />
        )}
        {tab === "targets" && (
          <Targets
            voiceProfile={voiceProfile}
            selectedInquiry={selectedInquiry} responseText={responseText}
            loading={generatingResponse} onSelect={generateResponse}
            onCopy={() => copy(responseText)} copied={copied}
          />
        )}
        {tab === "archive" && (
          <Archive
            voiceProfile={voiceProfile}
            selectedScenario={selectedScenario} scriptText={scriptText}
            loadingScript={generatingScript} onSelectScenario={generateScript}
            contentIdea={contentIdea} setContentIdea={setContentIdea}
            contentText={contentText} loadingContent={generatingContent}
            onGenerateContent={generateContent}
            onCopy={copy} copied={copied}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, height: "62px",
        background: "rgba(10,10,11,0.97)", backdropFilter: "blur(24px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? T.goldGlow : "none",
            border: `1px solid ${tab === t.id ? T.goldBorder : "transparent"}`,
            borderRadius: "8px", padding: "8px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
            cursor: "pointer", transition: "all 0.15s",
          }}>
            <span style={{ fontSize: "14px", color: tab === t.id ? T.gold : T.textDim }}>{t.icon}</span>
            <span style={{ fontFamily: MONO, fontSize: "8px", color: tab === t.id ? T.gold : T.textDim, letterSpacing: "0.1em" }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
