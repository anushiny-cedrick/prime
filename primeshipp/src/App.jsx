import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SHIPMENTS = [
  {
    id: "PSE-2026-0041", origin: "New York, USA", destination: "London, UK",
    status: "in_transit", eta: "Mar 14, 2026", customer: "Apex Global Corp",
    weight: "320 kg", type: "Air Freight", progress: 65,
    route: [
      { name: "New York (JFK)", lat: 40.64, lng: -73.78, time: "Mar 10, 09:00", done: true },
      { name: "Boston Hub", lat: 42.36, lng: -71.06, time: "Mar 10, 14:00", done: true },
      { name: "Reykjavik", lat: 64.14, lng: -21.90, time: "Mar 11, 06:00", done: true },
      { name: "Dublin Sort", lat: 53.35, lng: -6.26, time: "Mar 12, 11:00", done: false },
      { name: "London (LHR)", lat: 51.47, lng: -0.45, time: "Mar 14, 08:00", done: false },
    ], currentLat: 55.0, currentLng: -30.0,
  },
  {
    id: "PSE-2026-0082", origin: "Shanghai, China", destination: "Los Angeles, USA",
    status: "customs", eta: "Mar 12, 2026", customer: "Pacific Trade Ltd",
    weight: "1,400 kg", type: "Sea Freight", progress: 85,
    route: [
      { name: "Shanghai Port", lat: 31.23, lng: 121.47, time: "Mar 01, 08:00", done: true },
      { name: "Pacific Ocean", lat: 35.00, lng: 165.00, time: "Mar 05, 12:00", done: true },
      { name: "Hawaii Transit", lat: 21.31, lng: -157.86, time: "Mar 09, 16:00", done: true },
      { name: "LA Customs", lat: 33.94, lng: -118.41, time: "Mar 11, 09:00", done: false },
      { name: "LA Port", lat: 33.74, lng: -118.26, time: "Mar 12, 14:00", done: false },
    ], currentLat: 33.9, currentLng: -118.3,
  },
  {
    id: "PSE-2026-0117", origin: "Dubai, UAE", destination: "Nairobi, Kenya",
    status: "delivered", eta: "Mar 08, 2026", customer: "East Africa Ventures",
    weight: "210 kg", type: "Air Freight", progress: 100,
    route: [
      { name: "Dubai (DXB)", lat: 25.25, lng: 55.37, time: "Mar 06, 07:00", done: true },
      { name: "Muscat Transit", lat: 23.59, lng: 58.41, time: "Mar 06, 10:00", done: true },
      { name: "Mogadishu Air", lat: 2.01, lng: 45.30, time: "Mar 07, 14:00", done: true },
      { name: "Nairobi (NBO)", lat: -1.32, lng: 36.93, time: "Mar 08, 09:00", done: true },
    ], currentLat: -1.3, currentLng: 36.9,
  },
  {
    id: "PSE-2026-0203", origin: "Berlin, Germany", destination: "São Paulo, Brazil",
    status: "in_transit", eta: "Mar 16, 2026", customer: "Euro-Latam Holdings",
    weight: "560 kg", type: "Air Freight", progress: 40,
    route: [
      { name: "Berlin (BER)", lat: 52.37, lng: 13.50, time: "Mar 10, 06:00", done: true },
      { name: "Lisbon Hub", lat: 38.78, lng: -9.14, time: "Mar 10, 12:00", done: true },
      { name: "Atlantic", lat: 10.00, lng: -25.00, time: "Mar 12, 00:00", done: false },
      { name: "Recife Sort", lat: -8.05, lng: -34.88, time: "Mar 14, 08:00", done: false },
      { name: "São Paulo (GRU)", lat: -23.44, lng: -46.47, time: "Mar 16, 10:00", done: false },
    ], currentLat: 20.0, currentLng: -15.0,
  },
  {
    id: "PSE-2026-0298", origin: "Singapore", destination: "Sydney, Australia",
    status: "in_transit", eta: "Mar 11, 2026", customer: "AsiaPac Freight Co",
    weight: "880 kg", type: "Sea Freight", progress: 72,
    route: [
      { name: "Singapore Port", lat: 1.35, lng: 103.82, time: "Mar 07, 10:00", done: true },
      { name: "Jakarta Hub", lat: -6.21, lng: 106.85, time: "Mar 08, 06:00", done: true },
      { name: "Darwin Transit", lat: -12.46, lng: 130.84, time: "Mar 09, 14:00", done: true },
      { name: "Brisbane Sort", lat: -27.47, lng: 153.02, time: "Mar 10, 18:00", done: false },
      { name: "Sydney Port", lat: -33.87, lng: 151.21, time: "Mar 11, 10:00", done: false },
    ], currentLat: -20.0, currentLng: 140.0,
  },
];

const SERVICES = [
  { icon: "✈️", title: "Air Freight", desc: "Express cargo across 300+ international routes with guaranteed delivery windows and real-time updates.", color: "#f59e0b" },
  { icon: "🚢", title: "Ocean Freight", desc: "FCL and LCL ocean shipping with optimized container routing, port-to-port and door-to-door options.", color: "#3b82f6" },
  { icon: "🚛", title: "Road Freight", desc: "Cross-border trucking with live GPS monitoring on every vehicle across 80+ countries.", color: "#10b981" },
  { icon: "🏭", title: "Warehousing", desc: "Smart fulfillment centers with automated inventory management and climate-controlled storage.", color: "#8b5cf6" },
  { icon: "🛃", title: "Customs Brokerage", desc: "Certified customs agents in 158+ countries ensuring seamless border crossings and compliance.", color: "#ec4899" },
  { icon: "📲", title: "Last-Mile Delivery", desc: "Urban and rural delivery solutions with same-day and next-day options across major cities.", color: "#f59e0b" },
];

const NAV_LINKS = [
  { key: "home", label: "Home" },
  { key: "services", label: "Services" },
  { key: "track", label: "Track Shipment" },
  { key: "map", label: "Live Map" },
  { key: "dashboard", label: "Dashboard" },
  { key: "about", label: "About" },
  { key: "contact", label: "Contact" },
];

const MAP_CITIES = [
  { lat: 40.7, lng: -74 }, { lat: 34.05, lng: -118.24 }, { lat: 51.5, lng: -0.12 }, { lat: 48.85, lng: 2.35 },
  { lat: 52.52, lng: 13.4 }, { lat: 35.68, lng: 139.69 }, { lat: 31.23, lng: 121.47 }, { lat: 1.35, lng: 103.82 },
  { lat: 25.2, lng: 55.27 }, { lat: -1.29, lng: 36.82 }, { lat: -23.55, lng: -46.63 }, { lat: -33.87, lng: 151.21 },
  { lat: 19.43, lng: -99.13 }, { lat: 55.75, lng: 37.62 }, { lat: 28.61, lng: 77.21 }, { lat: 6.45, lng: 3.39 },
  { lat: -26.2, lng: 28.04 }, { lat: 43.65, lng: -79.38 }, { lat: 41.9, lng: 12.5 }, { lat: 37.57, lng: 126.98 },
];

function latlng(lat, lng, W = 800, H = 370) {
  const x = ((lng + 180) / 360) * W;
  const r = (lat * Math.PI) / 180;
  const m = Math.log(Math.tan(Math.PI / 4 + r / 2));
  return { x, y: H / 2 - (W * m) / (2 * Math.PI) };
}

const stLabel = s => ({ in_transit: "In Transit", delivered: "Delivered", customs: "Customs Clearance" }[s] || s);
const stClass = s => ({ in_transit: "sp-transit", delivered: "sp-delivered", customs: "sp-customs" }[s] || "");

// ─── AI CHAT ──────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Prime, the AI support assistant for PrimeShippExpress — a global freight and logistics company.

You are helpful, professional, friendly, and concise. You speak like a knowledgeable logistics expert who genuinely cares about customer needs.

About PrimeShippExpress:
- Global logistics company operating since 2008
- Serves 4,000+ businesses across 158 countries
- Services: Air Freight, Ocean Freight, Road Freight, Warehousing, Customs Brokerage, Last-Mile Delivery
- 98.7% on-time delivery rate
- ISO 9001, IATA, AEO certified
- 24/7 support: +1 (800) 874-2391 | ops@primeshippexpress.com
- HQ: 1 Prime Tower, New York, NY 10004
- Global offices: London, Dubai, Singapore, Shanghai, São Paulo, Lagos

Active shipments you can reference:
- PSE-2026-0041: New York → London, Air Freight, 65% complete, ETA Mar 14 (customer: Apex Global Corp)
- PSE-2026-0082: Shanghai → Los Angeles, Sea Freight, 85% complete, in customs (customer: Pacific Trade Ltd)
- PSE-2026-0117: Dubai → Nairobi, Air Freight, DELIVERED Mar 8 (customer: East Africa Ventures)
- PSE-2026-0203: Berlin → São Paulo, Air Freight, 40% complete, ETA Mar 16 (customer: Euro-Latam Holdings)
- PSE-2026-0298: Singapore → Sydney, Sea Freight, 72% complete, ETA Mar 11 (customer: AsiaPac Freight Co)

Keep answers short and helpful (2-4 sentences usually). Use bullet points only when listing multiple items. Never make up shipment IDs or data that isn't provided. If asked about a shipment not in your list, say you cannot find that ID and ask them to verify. Always be warm and solutions-focused.`;

async function askAI(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#08111f;--bg2:#0c1a2e;--bg3:#101f38;
  --gold:#f59e0b;--gold2:#fbbf24;
  --blue:#3b82f6;--green:#10b981;
  --txt:#eef2ff;--txt2:#7d8fb3;--txt3:#c7d2e7;
  --border:rgba(245,158,11,.14);--border2:rgba(255,255,255,.07);
  --ff:'Outfit',sans-serif;--fd:'Playfair Display',serif;
  --r:14px;--sh:0 20px 60px rgba(0,0,0,.55);
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--txt);font-family:var(--ff);overflow-x:hidden}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gold);border-radius:2px}

/* TOPBAR */
.topbar{background:linear-gradient(90deg,#b45309,var(--gold),#b45309);background-size:200%;animation:shim 5s linear infinite;color:#000;text-align:center;padding:.42rem 1rem;font-size:.76rem;font-weight:700;letter-spacing:.04em;position:relative;z-index:1001}
@keyframes shim{0%{background-position:0%}100%{background-position:200%}}

/* HEADER */
.header{position:sticky;top:0;z-index:1000;background:rgba(8,17,31,.96);backdrop-filter:blur(20px) saturate(160%);border-bottom:1px solid var(--border)}
.header.shadow{box-shadow:0 4px 30px rgba(0,0,0,.7)}
.hinner{max-width:1380px;margin:0 auto;display:flex;align-items:center;padding:0 1.5rem;height:66px;gap:1rem}

.logo{display:flex;align-items:center;gap:.6rem;cursor:pointer;flex-shrink:0}
.logo-box{width:36px;height:36px;border-radius:8px;flex-shrink:0;background:linear-gradient(135deg,var(--gold),#d97706);display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 3px 12px rgba(245,158,11,.4)}
.logo-words{line-height:1}
.logo-name{font-family:var(--fd);font-size:1.05rem;font-weight:700;color:var(--txt);white-space:nowrap}
.logo-name span{color:var(--gold)}
.logo-tag{font-size:.56rem;color:var(--txt2);letter-spacing:.12em;text-transform:uppercase;margin-top:2px}

.nav{display:flex;align-items:center;gap:.05rem;flex:1;justify-content:center}
.nl{padding:.42rem .72rem;border-radius:7px;color:var(--txt2);font-size:.8rem;font-weight:500;cursor:pointer;transition:color .2s,background .2s;white-space:nowrap;position:relative;border:none;background:none;font-family:var(--ff)}
.nl:hover{color:var(--txt);background:rgba(255,255,255,.06)}
.nl.act{color:var(--txt);background:rgba(255,255,255,.06)}
.nl.act::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:16px;height:2px;background:var(--gold);border-radius:1px}

.nright{display:flex;align-items:center;gap:.5rem;flex-shrink:0}
.nbtn-o{background:transparent;border:1.5px solid var(--gold);color:var(--gold);padding:.4rem 1rem;border-radius:7px;font-family:var(--ff);font-weight:700;font-size:.78rem;cursor:pointer;transition:background .2s,color .2s;white-space:nowrap}
.nbtn-o:hover{background:var(--gold);color:#000}
.nbtn-f{background:var(--gold);color:#000;border:none;padding:.42rem 1.1rem;border-radius:7px;font-family:var(--ff);font-weight:800;font-size:.78rem;cursor:pointer;white-space:nowrap;transition:opacity .2s,transform .2s;box-shadow:0 3px 14px rgba(245,158,11,.38)}
.nbtn-f:hover{opacity:.88;transform:translateY(-1px)}

.hburg{display:none;flex-direction:column;gap:4px;cursor:pointer;background:none;border:none;padding:4px;flex-shrink:0}
.hburg span{display:block;width:20px;height:2px;background:var(--txt);border-radius:1px}

.drawer{position:fixed;top:0;right:0;bottom:0;width:275px;z-index:2000;background:var(--bg2);border-left:1px solid var(--border);padding:1.5rem;display:flex;flex-direction:column;gap:.35rem;transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1)}
.drawer.open{transform:translateX(0)}
.drawer-close{align-self:flex-end;background:none;border:none;color:var(--txt2);font-size:1.3rem;cursor:pointer;margin-bottom:.75rem}
.drawer-logo{font-family:var(--fd);font-size:1.05rem;font-weight:700;color:var(--txt);margin-bottom:1.2rem;padding-bottom:.75rem;border-bottom:1px solid var(--border2)}
.drawer-logo span{color:var(--gold)}
.dlink{padding:.75rem .9rem;border-radius:7px;color:var(--txt);font-size:.88rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s;border:none;background:none;font-family:var(--ff);text-align:left;width:100%}
.dlink:hover,.dlink.act{background:rgba(255,255,255,.06);color:var(--gold)}
.drawer-overlay{position:fixed;inset:0;z-index:1999;background:rgba(0,0,0,.6);backdrop-filter:blur(3px)}
.drawer-btns{margin-top:auto;display:flex;flex-direction:column;gap:.6rem;padding-top:1rem;border-top:1px solid var(--border2)}

.page{animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

/* PAGE HEADERS */
.pg-hero{background:var(--bg2);padding:4rem 2rem 3rem;border-bottom:1px solid var(--border)}
.pg-hero-inner{max-width:1380px;margin:0 auto}
.eyebrow{display:inline-flex;align-items:center;gap:.45rem;color:var(--gold);font-size:.72rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.75rem}
.eyebrow::before{content:'';width:16px;height:2px;background:var(--gold)}
.pgtitle{font-family:var(--fd);font-size:clamp(1.7rem,3vw,2.6rem);font-weight:800;line-height:1.15;margin-bottom:.9rem}
.pgdesc{color:var(--txt2);font-size:.96rem;line-height:1.8;max-width:560px}
.shell{max-width:1380px;margin:0 auto;padding:3.5rem 2rem}

/* HERO */
.hero{min-height:calc(100vh - 66px);display:flex;align-items:center;padding:4.5rem 2rem 4rem;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 65% 55% at 15% 50%,rgba(245,158,11,.07) 0%,transparent 60%),radial-gradient(ellipse 45% 40% at 80% 30%,rgba(59,130,246,.06) 0%,transparent 55%)}
.hero-grid{position:absolute;inset:0;z-index:0;opacity:.03;background-image:repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(245,158,11,1) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(245,158,11,1) 60px)}
.hero-inner{max-width:1380px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 410px;gap:4rem;align-items:center;position:relative;z-index:1}
.badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.28);color:var(--gold);padding:.35rem .95rem;border-radius:100px;font-size:.73rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem}
.pdot{width:7px;height:7px;border-radius:50%;background:var(--gold);animation:pd 1.5s infinite}
@keyframes pd{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(1.4)}}
.hero h1{font-family:var(--fd);font-size:clamp(2.3rem,4vw,3.9rem);font-weight:800;line-height:1.1;margin-bottom:1.3rem}
.hero h1 em{font-style:normal;color:var(--gold)}
.hero-desc{color:var(--txt2);font-size:.98rem;line-height:1.8;max-width:490px;margin-bottom:2.2rem}
.hero-btns{display:flex;gap:.8rem;flex-wrap:wrap;margin-bottom:2.5rem}
.hbp{background:var(--gold);color:#000;border:none;padding:.82rem 1.9rem;border-radius:9px;font-family:var(--ff);font-weight:800;font-size:.9rem;cursor:pointer;transition:all .2s;box-shadow:0 5px 22px rgba(245,158,11,.38)}
.hbp:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(245,158,11,.5)}
.hbs{background:rgba(255,255,255,.06);border:1px solid var(--border2);color:var(--txt);padding:.82rem 1.7rem;border-radius:9px;font-family:var(--ff);font-weight:600;font-size:.9rem;cursor:pointer;transition:all .2s}
.hbs:hover{background:rgba(255,255,255,.1)}
.hero-trust{display:flex;gap:1.8rem;flex-wrap:wrap}
.ti{display:flex;align-items:center;gap:.42rem}
.ti-t{font-size:.76rem;color:var(--txt2);line-height:1.35}
.ti-t strong{display:block;color:var(--txt);font-size:.8rem}

.hcard{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:1.6rem;box-shadow:var(--sh)}
.hcard-t{font-family:var(--fd);font-size:1.05rem;font-weight:700;margin-bottom:.2rem}
.hcard-s{color:var(--txt2);font-size:.8rem;margin-bottom:1.2rem}
.hi{width:100%;background:rgba(255,255,255,.05);border:1.5px solid var(--border2);border-radius:8px;padding:.78rem 1.1rem;color:var(--txt);font-family:var(--ff);font-size:.88rem;outline:none;transition:border-color .2s;margin-bottom:.7rem}
.hi:focus{border-color:var(--gold)}
.hi::placeholder{color:var(--txt2)}
.hibtn{width:100%;background:var(--gold);color:#000;border:none;padding:.82rem;border-radius:8px;font-family:var(--ff);font-weight:800;font-size:.88rem;cursor:pointer;transition:opacity .2s}
.hibtn:hover{opacity:.87}
.hdiv{text-align:center;color:var(--txt2);font-size:.73rem;margin:1rem 0;position:relative}
.hdiv::before,.hdiv::after{content:'';position:absolute;top:50%;width:38%;height:1px;background:var(--border2)}
.hdiv::before{left:0}.hdiv::after{right:0}
.sids{display:flex;flex-wrap:wrap;gap:.4rem}
.sid{font-family:monospace;font-size:.74rem;padding:.22rem .6rem;background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.2);color:var(--gold);border-radius:5px;cursor:pointer;transition:background .2s}
.sid:hover{background:rgba(245,158,11,.2)}

/* STATS */
.statsbar{background:var(--bg3);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.stats-in{max-width:1380px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
.sc{padding:1.9rem 1.6rem;border-right:1px solid var(--border2);transition:background .2s}
.sc:last-child{border-right:none}
.sc:hover{background:rgba(245,158,11,.03)}
.sc-v{font-family:var(--fd);font-size:1.9rem;font-weight:700;line-height:1}
.sc-l{color:var(--txt2);font-size:.78rem;margin:.22rem 0 .1rem}
.sc-s{font-size:.72rem;font-weight:700}

/* SERVICES */
.svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.15rem}
.svc-card{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r);padding:1.9rem;transition:transform .25s,border-color .25s,box-shadow .25s;cursor:default}
.svc-card:hover{transform:translateY(-4px);border-color:rgba(245,158,11,.3);box-shadow:0 14px 42px rgba(0,0,0,.4)}
.svc-ic{width:48px;height:48px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin-bottom:1rem}
.svc-t{font-family:var(--fd);font-size:1rem;font-weight:700;margin-bottom:.45rem}
.svc-d{color:var(--txt2);font-size:.84rem;line-height:1.7;margin-bottom:1rem}
.svc-more{font-size:.78rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:.32rem;transition:gap .2s}
.svc-more:hover{gap:.55rem}

/* TRACKING */
.tcard{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh)}
.thead{padding:1.5rem 2rem;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem}
.thead-t{font-family:var(--fd);font-size:1rem;font-weight:700}
.thead-s{color:var(--txt2);font-size:.78rem;margin-top:.12rem}
.tdots{display:flex;gap:.45rem}
.dot{width:10px;height:10px;border-radius:50%}
.tbody{padding:2rem}
.tig{display:flex;gap:.65rem;margin-bottom:1.1rem}
.tinput{flex:1;background:rgba(255,255,255,.05);border:1.5px solid var(--border2);border-radius:8px;padding:.82rem 1.2rem;color:var(--txt);font-family:var(--ff);font-size:.9rem;outline:none;transition:border-color .2s}
.tinput:focus{border-color:var(--gold)}
.tinput::placeholder{color:var(--txt2)}
.tbtn{background:var(--gold);color:#000;padding:.82rem 1.9rem;border-radius:8px;font-family:var(--ff);font-weight:800;font-size:.88rem;border:none;cursor:pointer;white-space:nowrap;transition:opacity .2s,transform .2s}
.tbtn:hover{opacity:.87;transform:translateY(-1px)}
.tsamps{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap;font-size:.76rem;color:var(--txt2)}
.tsam{font-family:monospace;font-size:.76rem;padding:.2rem .58rem;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.18);color:var(--gold);border-radius:5px;cursor:pointer;transition:background .2s}
.tsam:hover{background:rgba(245,158,11,.18)}
.notfound{margin-top:1.2rem;padding:1rem;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:9px;color:#fca5a5;font-size:.84rem;text-align:center}
.res{margin-top:1.4rem;border:1px solid var(--border);border-radius:11px;overflow:hidden;animation:fadeIn .4s ease}
.rhead{padding:1.35rem 1.75rem;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem}
.rid{font-family:monospace;font-size:1.4rem;font-weight:700;color:var(--gold);letter-spacing:.05em}
.rcust{color:var(--txt2);font-size:.8rem;margin-top:.18rem}
.spill{display:inline-flex;align-items:center;gap:.3rem;padding:.28rem .82rem;border-radius:100px;font-size:.71rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.sp-transit{background:rgba(59,130,246,.14);color:#60a5fa;border:1px solid rgba(59,130,246,.28)}
.sp-delivered{background:rgba(16,185,129,.14);color:#34d399;border:1px solid rgba(16,185,129,.28)}
.sp-customs{background:rgba(245,158,11,.14);color:var(--gold);border:1px solid rgba(245,158,11,.28)}
.rgrid{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--border)}
.rc{padding:1.1rem 1.75rem;border-right:1px solid var(--border)}
.rc:last-child{border-right:none}
.rc-l{font-size:.69rem;text-transform:uppercase;letter-spacing:.09em;color:var(--txt2);margin-bottom:.25rem}
.rc-v{font-weight:700;font-size:.88rem}
.rprog{padding:1.35rem 1.75rem;border-bottom:1px solid var(--border)}
.rprow{display:flex;justify-content:space-between;font-size:.79rem;margin-bottom:.42rem;color:var(--txt2)}
.rpct{font-weight:800;color:var(--gold)}
.pbar{height:7px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
.pfill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--gold),#10b981);transition:width 1.2s cubic-bezier(.4,0,.2,1)}
.rtl{padding:1.35rem 1.75rem}
.rtl-t{font-family:var(--fd);font-weight:700;font-size:.9rem;margin-bottom:1rem}
.steps{display:flex;overflow-x:auto;padding-bottom:4px}
.step{display:flex;flex-direction:column;align-items:center;min-width:132px;position:relative}
.step:not(:last-child)::after{content:'';position:absolute;top:12px;left:calc(50% + 10px);width:calc(100% - 20px);height:2px;background:var(--border2)}
.step.ds:not(:last-child)::after{background:var(--gold)}
.snode{width:25px;height:25px;border-radius:50%;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;font-size:.67rem;font-weight:900}
.sn-done{background:var(--gold);color:#000}
.sn-cur{background:var(--blue);color:#fff;animation:rip 1.8s infinite}
@keyframes rip{0%{box-shadow:0 0 0 0 rgba(59,130,246,.5)}100%{box-shadow:0 0 0 11px rgba(59,130,246,0)}}
.sn-pend{background:rgba(255,255,255,.08);color:var(--txt2);border:2px solid var(--border2)}
.sname{font-size:.69rem;font-weight:700;text-align:center;margin-top:.42rem;line-height:1.3}
.stime{font-size:.61rem;color:var(--txt2);text-align:center;margin-top:.15rem}

/* MAP */
.mapwrap{border-radius:var(--r);overflow:hidden;border:1px solid var(--border);background:#060d1c}
.mapsvg{width:100%;display:block}
.mf-row{display:flex;gap:.65rem;flex-wrap:wrap;margin-bottom:1.2rem}
.mfb{padding:.42rem 1rem;border-radius:7px;border:1.5px solid var(--border2);background:var(--bg3);color:var(--txt2);cursor:pointer;font-size:.77rem;font-weight:600;transition:all .2s}
.mfb.act{border-color:var(--gold);color:var(--gold);background:rgba(245,158,11,.08)}
.mapinfo{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--border)}
.mic{padding:.85rem 1.4rem;border-right:1px solid var(--border)}
.mic:last-child{border-right:none}
.mic-l{font-size:.69rem;text-transform:uppercase;letter-spacing:.08em;color:var(--txt2)}
.mic-v{font-weight:800;font-size:.86rem;margin-top:.16rem}

/* DASHBOARD */
.dash-g{display:grid;grid-template-columns:3fr 2fr;gap:1.2rem}
.dc{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r);overflow:hidden}
.dch{padding:1.35rem 1.75rem;background:var(--bg3);border-bottom:1px solid var(--border2);display:flex;justify-content:space-between;align-items:center}
.dcht{font-family:var(--fd);font-weight:700;font-size:.95rem}
.livebadge{display:flex;align-items:center;gap:.3rem;font-size:.69rem;color:var(--green);font-weight:700}
.ldot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pd 1.5s infinite}
.dsr{display:flex;justify-content:space-between;align-items:center;padding:.88rem 1.75rem;border-bottom:1px solid var(--border2);cursor:pointer;transition:background .2s}
.dsr:last-child{border-bottom:none}
.dsr:hover{background:rgba(255,255,255,.03)}
.dsrid{font-family:monospace;font-size:.85rem;color:var(--gold)}
.dsrr{font-size:.74rem;color:var(--txt2);margin-top:.1rem}
.dsrright{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.mbar{width:68px;height:4px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden}
.mfill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--gold),var(--green))}
.mrow{padding:.9rem 1.75rem;border-bottom:1px solid var(--border2)}
.mrow:last-child{border-bottom:none}
.mtop{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;margin-bottom:.42rem}
.mpct{font-weight:800;font-size:.82rem}
.mmetbar{height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.mmetfill{height:100%;border-radius:3px}

/* ABOUT */
.about-g{display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;align-items:start}
.afeat{display:flex;gap:.85rem;margin-bottom:1.5rem}
.afic{width:42px;height:42px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.05rem;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2)}
.aft{font-weight:700;font-size:.9rem;margin-bottom:.2rem}
.afd{color:var(--txt2);font-size:.83rem;line-height:1.65}
.certs-panel{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:2rem}
.cert-g{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;margin-top:1.3rem}
.cert-c{background:var(--bg3);border:1px solid var(--border2);border-radius:9px;padding:1.1rem;text-align:center}
.cert-ic{font-size:1.7rem;margin-bottom:.35rem}
.cert-t{font-weight:700;font-size:.84rem}
.cert-s{color:var(--txt2);font-size:.72rem;margin-top:.12rem}

/* CONTACT */
.contact-g{display:grid;grid-template-columns:1fr 1fr;gap:3.5rem}
.cii{display:flex;gap:.85rem;margin-bottom:1.5rem}
.ciic{width:44px;height:44px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.05rem;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2)}
.ciit{font-weight:700;margin-bottom:.18rem}
.ciid{color:var(--txt2);font-size:.85rem;line-height:1.6}
.cform{display:flex;flex-direction:column;gap:.85rem}
.crow{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
.cinput,.ctextarea,.cselect{width:100%;background:rgba(255,255,255,.04);border:1.5px solid var(--border2);border-radius:8px;padding:.8rem 1.15rem;color:var(--txt);font-family:var(--ff);font-size:.87rem;outline:none;transition:border-color .2s}
.cinput:focus,.ctextarea:focus,.cselect:focus{border-color:var(--gold)}
.cinput::placeholder,.ctextarea::placeholder{color:var(--txt2)}
.ctextarea{resize:vertical;min-height:125px}
.cselect{appearance:none;cursor:pointer}
.cselect option{background:var(--bg3)}
.csubmit{align-self:flex-start;background:var(--gold);color:#000;border:none;padding:.82rem 2.2rem;border-radius:8px;font-family:var(--ff);font-weight:800;font-size:.9rem;cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(245,158,11,.35)}
.csubmit:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(245,158,11,.5)}

/* ══════════════════════════════════════════════════
   CHAT — FLOATING BUTTON & FULL WINDOW
═══════════════════════════════════════════════════*/

/* Floating button */
.chat-fab{
  position:fixed;bottom:2rem;right:2rem;z-index:3000;
  width:60px;height:60px;border-radius:50%;
  background:linear-gradient(135deg,var(--gold),#d97706);
  border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 6px 28px rgba(245,158,11,.55);
  transition:transform .25s,box-shadow .25s;
  font-size:1.5rem;
}
.chat-fab:hover{transform:scale(1.1) translateY(-2px);box-shadow:0 12px 40px rgba(245,158,11,.65)}
.chat-fab-badge{
  position:absolute;top:-3px;right:-3px;
  width:18px;height:18px;border-radius:50%;
  background:#ef4444;border:2px solid var(--bg);
  font-size:.62rem;font-weight:800;color:#fff;
  display:flex;align-items:center;justify-content:center;
  animation:badgePop .3s cubic-bezier(.34,1.56,.64,1);
}
@keyframes badgePop{from{transform:scale(0)}to{transform:scale(1)}}

/* Chat window */
.chat-window{
  position:fixed;bottom:6rem;right:2rem;z-index:2999;
  width:390px;height:600px;
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:20px;
  display:flex;flex-direction:column;
  overflow:hidden;
  box-shadow:0 24px 80px rgba(0,0,0,.75),0 0 0 1px rgba(245,158,11,.08);
  animation:chatIn .35s cubic-bezier(.34,1.56,.64,1);
  transform-origin:bottom right;
}
@keyframes chatIn{from{opacity:0;transform:scale(.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}

/* Chat header */
.chat-head{
  padding:1rem 1.25rem;
  background:linear-gradient(135deg,#0d1e36,#101f38);
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:.85rem;
  flex-shrink:0;
}
.chat-avatar{
  width:40px;height:40px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--gold),#d97706);
  display:flex;align-items:center;justify-content:center;
  font-size:1.15rem;
  box-shadow:0 0 0 3px rgba(245,158,11,.2);
  position:relative;
}
.chat-avatar-online{
  position:absolute;bottom:1px;right:1px;
  width:10px;height:10px;border-radius:50%;
  background:var(--green);border:2px solid var(--bg2);
}
.chat-head-info{flex:1}
.chat-head-name{font-weight:700;font-size:.92rem;font-family:var(--fd)}
.chat-head-status{font-size:.72rem;color:var(--green);display:flex;align-items:center;gap:.3rem;margin-top:.1rem}
.chat-head-status::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);animation:pd 1.5s infinite}
.chat-close{background:none;border:none;color:var(--txt2);font-size:1.1rem;cursor:pointer;padding:.25rem;border-radius:6px;transition:color .2s,background .2s}
.chat-close:hover{color:var(--txt);background:rgba(255,255,255,.08)}

/* Chat body */
.chat-body{
  flex:1;overflow-y:auto;padding:1.25rem;
  display:flex;flex-direction:column;gap:.85rem;
  scroll-behavior:smooth;
}
.chat-body::-webkit-scrollbar{width:3px}
.chat-body::-webkit-scrollbar-thumb{background:rgba(245,158,11,.3);border-radius:2px}

/* Messages */
.msg{display:flex;gap:.6rem;align-items:flex-end;animation:msgIn .25s ease}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.msg.user{flex-direction:row-reverse}
.msg-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.8rem}
.msg-avatar-bot{background:linear-gradient(135deg,var(--gold),#d97706)}
.msg-avatar-user{background:linear-gradient(135deg,#3b82f6,#1d4ed8)}
.msg-bubble{
  max-width:78%;padding:.75rem 1rem;border-radius:14px;
  font-size:.84rem;line-height:1.6;
}
.msg-bubble-bot{
  background:var(--bg3);border:1px solid var(--border2);
  border-bottom-left-radius:4px;color:var(--txt);
}
.msg-bubble-user{
  background:linear-gradient(135deg,#1e40af,#1d4ed8);
  border-bottom-right-radius:4px;color:#fff;
}
.msg-time{font-size:.62rem;color:var(--txt2);margin-top:.3rem;padding:0 .25rem}
.msg.user .msg-time{text-align:right}

/* Typing indicator */
.typing{display:flex;gap:.6rem;align-items:flex-end}
.typing-bubble{background:var(--bg3);border:1px solid var(--border2);padding:.75rem 1rem;border-radius:14px;border-bottom-left-radius:4px;display:flex;gap:.35rem;align-items:center}
.typing-dot{width:7px;height:7px;border-radius:50%;background:var(--txt2)}
.typing-dot:nth-child(1){animation:td .9s infinite .0s}
.typing-dot:nth-child(2){animation:td .9s infinite .2s}
.typing-dot:nth-child(3){animation:td .9s infinite .4s}
@keyframes td{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}

/* Quick replies */
.quick-replies{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.25rem}
.qr{
  padding:.38rem .82rem;border-radius:20px;
  border:1px solid rgba(245,158,11,.3);
  background:rgba(245,158,11,.07);
  color:var(--gold);font-size:.76rem;font-weight:600;
  cursor:pointer;transition:background .2s,border-color .2s;
  white-space:nowrap;
}
.qr:hover{background:rgba(245,158,11,.18);border-color:rgba(245,158,11,.5)}

/* Chat input */
.chat-footer{
  padding:.9rem 1rem;border-top:1px solid var(--border);
  background:var(--bg3);flex-shrink:0;
}
.chat-input-row{display:flex;gap:.6rem;align-items:flex-end}
.chat-input{
  flex:1;background:rgba(255,255,255,.05);
  border:1.5px solid var(--border2);border-radius:12px;
  padding:.7rem 1rem;color:var(--txt);
  font-family:var(--ff);font-size:.85rem;outline:none;
  transition:border-color .2s;resize:none;
  max-height:100px;min-height:42px;line-height:1.5;
}
.chat-input:focus{border-color:var(--gold)}
.chat-input::placeholder{color:var(--txt2)}
.chat-send{
  width:40px;height:40px;border-radius:10px;
  background:var(--gold);border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:1rem;transition:opacity .2s,transform .2s;
  flex-shrink:0;
}
.chat-send:hover{opacity:.88;transform:scale(1.05)}
.chat-send:disabled{opacity:.4;cursor:not-allowed;transform:none}
.chat-disclaimer{font-size:.65rem;color:var(--txt2);text-align:center;margin-top:.55rem}

/* FOOTER */
footer{background:var(--bg3);border-top:1px solid var(--border)}
.ftop{max-width:1380px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2.5rem;padding:3rem 2rem 2.5rem}
.fbrand p{color:var(--txt2);font-size:.83rem;line-height:1.75;margin:.9rem 0 1.3rem;max-width:255px}
.fsoc{display:flex;gap:.5rem}
.fsl{width:33px;height:33px;border-radius:7px;background:rgba(255,255,255,.06);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:.82rem;cursor:pointer;color:var(--txt2);transition:all .2s}
.fsl:hover{background:rgba(245,158,11,.14);border-color:rgba(245,158,11,.3);color:var(--gold)}
.fcol h5{font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt2);margin-bottom:1rem}
.fcol ul{list-style:none;display:flex;flex-direction:column;gap:.55rem}
.fcol ul li a{color:var(--txt3);font-size:.83rem;cursor:pointer;transition:color .2s;text-decoration:none}
.fcol ul li a:hover{color:var(--gold)}
.fbot{border-top:1px solid var(--border2);max-width:1380px;margin:0 auto;padding:1.3rem 2rem;display:flex;justify-content:space-between;align-items:center;color:var(--txt2);font-size:.77rem;flex-wrap:wrap;gap:.6rem}
.fcerts{display:flex;gap:.65rem}
.fct{padding:.18rem .65rem;border-radius:4px;background:rgba(255,255,255,.05);border:1px solid var(--border2);font-size:.68rem;color:var(--txt2);font-weight:600}

/* TOAST */
.toast{position:fixed;bottom:8rem;right:2rem;z-index:9999;background:var(--bg3);border:1px solid rgba(245,158,11,.35);border-radius:11px;padding:.95rem 1.4rem;display:flex;align-items:center;gap:.75rem;box-shadow:0 12px 40px rgba(0,0,0,.6);animation:tin .35s cubic-bezier(.34,1.56,.64,1);min-width:260px}
@keyframes tin{from{opacity:0;transform:translateX(100%) scale(.9)}to{opacity:1;transform:translateX(0) scale(1)}}
.t-ic{font-size:1.3rem;flex-shrink:0}
.t-b strong{display:block;font-family:var(--fd);color:var(--gold);font-size:.9rem}
.t-b span{font-size:.79rem;color:var(--txt2)}

/* RESPONSIVE */
@media(max-width:1100px){
  .hero-inner{grid-template-columns:1fr}
  .about-g{grid-template-columns:1fr}
  .dash-g{grid-template-columns:1fr}
  .ftop{grid-template-columns:1fr 1fr}
  .nav{display:none}
  .hburg{display:flex}
  .nbtn-o{display:none}
}
@media(max-width:768px){
  .stats-in{grid-template-columns:1fr 1fr}
  .svc-grid{grid-template-columns:1fr 1fr}
  .rgrid{grid-template-columns:1fr 1fr}
  .contact-g{grid-template-columns:1fr}
  .mapinfo{grid-template-columns:1fr 1fr}
  .shell{padding:2.5rem 1.25rem}
  .pg-hero{padding:3rem 1.25rem 2.5rem}
  .chat-window{width:calc(100vw - 2rem);right:1rem;bottom:5.5rem}
}
@media(max-width:520px){
  .svc-grid{grid-template-columns:1fr}
  .ftop{grid-template-columns:1fr}
  .crow{grid-template-columns:1fr}
  .hinner{padding:0 1rem}
  .hero{padding:3.5rem 1.25rem 3rem}
  .rgrid{grid-template-columns:1fr 1fr}
  .chat-fab{bottom:1.25rem;right:1.25rem}
}
`;

// ─── MAP SVG ──────────────────────────────────────────────────────────────────
function MapSVG({ ship }) {
  const W = 800, H = 370;
  const pts = ship ? ship.route.map(r => latlng(r.lat, r.lng, W, H)) : [];
  const pd = pts.length > 1 ? pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") : "";
  const cur = ship ? latlng(ship.currentLat, ship.currentLng, W, H) : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mapsvg">
      <defs>
        <pattern id="gg" width="40" height="30" patternUnits="userSpaceOnUse">
          <path d="M40 0L0 0 0 30" fill="none" stroke="rgba(245,158,11,.04)" strokeWidth=".5" />
        </pattern>
        <radialGradient id="bgr" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245,158,11,.05)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="gl"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="sgl"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width={W} height={H} fill="url(#gg)" />
      <ellipse cx={W / 2} cy={H / 2} rx={W * .45} ry={H * .45} fill="url(#bgr)" />
      {MAP_CITIES.map((c, i) => { const { x, y } = latlng(c.lat, c.lng, W, H); return (<g key={i}><circle cx={x} cy={y} r={5} fill="rgba(245,158,11,.07)" /><circle cx={x} cy={y} r={2.2} fill="rgba(245,158,11,.45)" /></g>) })}
      {pd && <><path d={pd} fill="none" stroke="rgba(245,158,11,.18)" strokeWidth="2" strokeDasharray="5 5" /><path d={pd} fill="none" stroke="#f59e0b" strokeWidth="2" style={{ filter: "url(#gl)" }} /></>}
      {ship && ship.route.map((s, i) => { const { x, y } = latlng(s.lat, s.lng, W, H); return (<g key={i} filter={s.done ? "url(#gl)" : ""}><circle cx={x} cy={y} r={s.done ? 5.5 : 4} fill={s.done ? "#f59e0b" : "rgba(255,255,255,.1)"} stroke={s.done ? "#f59e0b" : "rgba(255,255,255,.25)"} strokeWidth="1.5" /><text x={x + 9} y={y + 4} fill={s.done ? "#fbbf24" : "#64748b"} fontSize="9" fontFamily="Outfit,sans-serif" fontWeight="600">{s.name.split(",")[0]}</text></g>) })}
      {cur && <g filter="url(#sgl)"><circle cx={cur.x} cy={cur.y} r={13} fill="rgba(59,130,246,.12)" stroke="rgba(59,130,246,.3)" strokeWidth="1" /><circle cx={cur.x} cy={cur.y} r={5.5} fill="#3b82f6" /><text x={cur.x + 16} y={cur.y + 4} fill="#60a5fa" fontSize="9" fontWeight="800" fontFamily="Outfit,sans-serif">LIVE</text></g>}
    </svg>
  );
}

// ─── CHAT COMPONENT ───────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "Track my shipment",
  "What services do you offer?",
  "How long does air freight take?",
  "How do I get a quote?",
  "What countries do you serve?",
  "Where are your offices?",
];

const NOW = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! 👋 I'm **Prime**, your PrimeShippExpress AI assistant. I can help you with shipment tracking, quotes, service info, and more.\n\nHow can I help you today?",
      time: NOW(),
      id: 1,
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoad] = useState(false);
  const [history, setHist] = useState([]);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  const formatMsg = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg, time: NOW(), id: Date.now() };
    const newHist = [...history, { role: "user", content: msg }];

    setMessages(prev => [...prev, userMsg]);
    setHist(newHist);
    setLoad(true);

    try {
      const reply = await askAI(newHist);
      const botMsg = { role: "assistant", content: reply, time: NOW(), id: Date.now() + 1 };
      setMessages(prev => [...prev, botMsg]);
      setHist(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again or call us at +1 (800) 874-2391.",
        time: NOW(),
        id: Date.now() + 1,
      }]);
    }
    setLoad(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const showQuickReplies = messages.length === 1;

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-head">
        <div className="chat-avatar">
          ✈
          <div className="chat-avatar-online" />
        </div>
        <div className="chat-head-info">
          <div className="chat-head-name">Prime — AI Support</div>
          <div className="chat-head-status">Online · Typically replies instantly</div>
        </div>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="chat-body" ref={bodyRef}>
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role === "user" ? "user" : ""}`}>
            <div className={`msg-avatar ${m.role === "user" ? "msg-avatar-user" : "msg-avatar-bot"}`}>
              {m.role === "user" ? "👤" : "✈"}
            </div>
            <div>
              <div
                className={`msg-bubble ${m.role === "user" ? "msg-bubble-user" : "msg-bubble-bot"}`}
                dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }}
              />
              <div className="msg-time">{m.time}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="typing">
            <div className="msg-avatar msg-avatar-bot">✈</div>
            <div>
              <div className="typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        {/* Quick replies (shown only at start) */}
        {showQuickReplies && !loading && (
          <div className="quick-replies">
            {QUICK_REPLIES.map(q => (
              <button key={q} className="qr" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-footer">
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button className="chat-send" onClick={() => send()} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
        <div className="chat-disclaimer">Powered by PrimeShippExpress AI · Available 24/7</div>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function HomePage({ nav }) {
  const [q, setQ] = useState("");
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-bg" /><div className="hero-grid" />
        <div className="hero-inner">
          <div>
            <div className="badge"><span className="pdot" /> Live — 3,241 Shipments In Transit</div>
            <h1>Delivering the World,<br /><em>On Time.</em> Every Time.</h1>
            <p className="hero-desc">PrimeShippExpress connects businesses to a global freight network spanning 158 countries. Air, sea, road — tracked in real time, door to door.</p>
            <div className="hero-btns">
              <button className="hbp" onClick={() => nav("track")}>Track Your Shipment →</button>
              <button className="hbs" onClick={() => nav("services")}>Explore Services</button>
            </div>
            <div className="hero-trust">
              {[["🛡️", "ISO 9001", "Certified Quality"], ["⚡", "98.7%", "On-Time Rate"], ["🌍", "158+", "Countries"]].map(([ic, v, l], i) => (
                <div className="ti" key={i}><span style={{ fontSize: "1.1rem" }}>{ic}</span><div className="ti-t"><strong>{v}</strong>{l}</div></div>
              ))}
            </div>
          </div>
          <div>
            <div className="hcard">
              <div className="hcard-t">⚡ Quick Track</div>
              <div className="hcard-s">Enter your tracking number for instant updates</div>
              <input className="hi" placeholder="e.g. PSE-2026-0041" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && nav("track", q)} />
              <button className="hibtn" onClick={() => nav("track", q)}>Track Now →</button>
              <div className="hdiv">Try these sample IDs</div>
              <div className="sids">{SHIPMENTS.slice(0, 4).map(s => <span key={s.id} className="sid" onClick={() => setQ(s.id)}>{s.id}</span>)}</div>
            </div>
          </div>
        </div>
      </section>
      <div className="statsbar">
        <div className="stats-in">
          {[["3,241", "Active Shipments", "+14% this month", "#f59e0b", "📦"], ["98.7%", "On-Time Delivery", "Industry leading", "#10b981", "🎯"], ["158", "Countries Served", "Global network", "#3b82f6", "🌍"], ["62,400", "Tons This Quarter", "Freight handled", "#8b5cf6", "🚢"]].map(([v, l, s, c, ic], i) => (
            <div className="sc" key={i}>
              <div style={{ fontSize: "1.35rem", marginBottom: ".35rem" }}>{ic}</div>
              <div className="sc-v" style={{ color: c }}>{v}</div>
              <div className="sc-l">{l}</div>
              <div className="sc-s" style={{ color: c }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--bg2)", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <div className="eyebrow">What We Offer</div>
          <h2 className="pgtitle">Complete Logistics Solutions</h2>
          <p style={{ color: "var(--txt2)", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 550, marginBottom: "2.5rem" }}>From warehouse to destination — full supply chain visibility and control.</p>
          <div className="svc-grid">
            {SERVICES.map((s, i) => (
              <div className="svc-card" key={i}>
                <div className="svc-ic" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>{s.icon}</div>
                <div className="svc-t">{s.title}</div>
                <p className="svc-d">{s.desc}</p>
                <span className="svc-more" style={{ color: s.color }} onClick={() => nav("services")}>Learn more →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ nav }) {
  return (
    <div className="page">
      <div className="pg-hero"><div className="pg-hero-inner">
        <div className="eyebrow">Our Services</div>
        <h1 className="pgtitle">Complete Logistics Solutions</h1>
        <p className="pgdesc">From warehouse to destination — every step of your supply chain, handled with precision across 158 countries.</p>
      </div></div>
      <div className="shell">
        <div className="svc-grid" style={{ marginBottom: "3.5rem" }}>
          {SERVICES.map((s, i) => (
            <div className="svc-card" key={i}>
              <div className="svc-ic" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>{s.icon}</div>
              <div className="svc-t">{s.title}</div>
              <p className="svc-d">{s.desc}</p>
              <span className="svc-more" style={{ color: s.color }} onClick={() => nav("contact")}>Request a quote →</span>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "2.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "1.45rem", fontWeight: 800, marginBottom: ".45rem" }}>Ready to ship with PrimeShippExpress?</div>
            <div style={{ color: "var(--txt2)", fontSize: ".9rem" }}>Get a custom quote within 2 hours from our logistics specialists.</div>
          </div>
          <button className="hbp" onClick={() => nav("contact")}>Get a Free Quote →</button>
        </div>
      </div>
    </div>
  );
}

function TrackPage({ initQ }) {
  const [q, setQ] = useState(initQ || "");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { if (initQ) { setQ(initQ); track(initQ); } }, [initQ]);

  const track = (val) => {
    const v = (val || q).trim().toLowerCase();
    const f = SHIPMENTS.find(s => s.id.toLowerCase() === v || s.customer.toLowerCase().includes(v));
    if (f) { setResult(f); setNotFound(false); } else { setResult(null); setNotFound(true); }
  };
  const nodeState = (stop, i, route) => {
    if (stop.done) return "done";
    const ld = route.reduce((a, s, idx) => s.done ? idx : a, -1);
    return i === ld + 1 ? "cur" : "pend";
  };
  return (
    <div className="page">
      <div className="pg-hero"><div className="pg-hero-inner">
        <div className="eyebrow">Shipment Tracking</div>
        <h1 className="pgtitle">Track Your Cargo in Real Time</h1>
        <p className="pgdesc">Enter a tracking ID or company name for full route visibility, live location, and estimated arrival.</p>
      </div></div>
      <div className="shell">
        <div className="tcard">
          <div className="thead">
            <div><div className="thead-t">PrimeShippExpress Tracking Portal</div><div className="thead-s">Live updates every 2 min · Encrypted · GDPR compliant</div></div>
            <div className="tdots"><div className="dot" style={{ background: "#ef4444" }} /><div className="dot" style={{ background: "#f59e0b" }} /><div className="dot" style={{ background: "#10b981" }} /></div>
          </div>
          <div className="tbody">
            <div className="tig">
              <input className="tinput" placeholder="Enter tracking number or company name..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && track()} />
              <button className="tbtn" onClick={() => track()}>Track →</button>
            </div>
            <div className="tsamps"><span>Try:</span>{SHIPMENTS.map(s => <span key={s.id} className="tsam" onClick={() => { setQ(s.id); track(s.id) }}>{s.id}</span>)}</div>
            {notFound && <div className="notfound">⚠️ No shipment found for "<strong>{q}</strong>". Please verify the ID and try again.</div>}
            {result && (
              <div className="res">
                <div className="rhead">
                  <div><div className="rid">{result.id}</div><div className="rcust">{result.customer} · {result.type}</div></div>
                  <span className={`spill ${stClass(result.status)}`}><span style={{ fontSize: ".5rem" }}>●</span> {stLabel(result.status)}</span>
                </div>
                <div className="rgrid">
                  {[["Origin", `📍 ${result.origin}`], ["Destination", `🎯 ${result.destination}`], ["Est. Arrival", `🕐 ${result.eta}`], ["Weight", `⚖️ ${result.weight}`]].map(([l, v], i) => (
                    <div className="rc" key={i}><div className="rc-l">{l}</div><div className="rc-v">{v}</div></div>
                  ))}
                </div>
                <div className="rprog">
                  <div className="rprow"><span>Delivery Progress</span><span className="rpct">{result.progress}% Complete</span></div>
                  <div className="pbar"><div className="pfill" style={{ width: `${result.progress}%` }} /></div>
                </div>
                <div className="rtl">
                  <div className="rtl-t">Route Timeline</div>
                  <div className="steps">
                    {result.route.map((stop, i, arr) => {
                      const st = nodeState(stop, i, arr);
                      return (<div key={i} className={`step${stop.done ? " ds" : ""}`}><div className={`snode sn-${st === "done" ? "done" : st === "cur" ? "cur" : "pend"}`}>{st === "done" ? "✓" : i + 1}</div><div className="sname">{stop.name.split(",")[0]}</div><div className="stime">{stop.time}</div></div>);
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MapPage() {
  const [sel, setSel] = useState(SHIPMENTS[0]);
  return (
    <div className="page">
      <div className="pg-hero"><div className="pg-hero-inner">
        <div className="eyebrow">Live Map</div>
        <h1 className="pgtitle">Global Fleet Overview</h1>
        <p className="pgdesc">Real-time visualization of active shipments. Select a shipment to view its live route.</p>
      </div></div>
      <div className="shell">
        <div className="mf-row">{SHIPMENTS.map(s => <button key={s.id} className={`mfb${sel?.id === s.id ? " act" : ""}`} onClick={() => setSel(s)}>{s.id} · {s.origin.split(",")[0]} → {s.destination.split(",")[0]}</button>)}</div>
        <div className="mapwrap">
          <MapSVG ship={sel} />
          {sel && <div className="mapinfo"><div className="mic"><div className="mic-l">Shipment</div><div className="mic-v" style={{ color: "var(--gold)", fontFamily: "monospace" }}>{sel.id}</div></div><div className="mic"><div className="mic-l">Route</div><div className="mic-v">{sel.origin.split(",")[0]} → {sel.destination.split(",")[0]}</div></div><div className="mic"><div className="mic-l">Status</div><div className="mic-v"><span className={`spill ${stClass(sel.status)}`} style={{ fontSize: ".69rem", padding: ".17rem .52rem" }}>{stLabel(sel.status)}</span></div></div><div className="mic"><div className="mic-l">Progress</div><div className="mic-v" style={{ color: "var(--gold)" }}>{sel.progress}%</div></div></div>}
        </div>
        <div style={{ marginTop: "1.25rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "1.25rem 1.75rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {[["var(--gold)", "Completed Stop"], ["#3b82f6", "Live Position"], ["rgba(255,255,255,.25)", "Upcoming Stop"]].map(([c, l], i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: ".45rem", fontSize: ".79rem", color: "var(--txt2)" }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />{l}</div>))}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ nav }) {
  const metrics = [{ l: "Air Freight On-Time", p: 98, c: "#f59e0b" }, { l: "Ocean Freight On-Time", p: 95, c: "#3b82f6" }, { l: "Road Freight On-Time", p: 97, c: "#10b981" }, { l: "Customs Clearance", p: 99, c: "#8b5cf6" }, { l: "Customer Satisfaction", p: 96, c: "#ec4899" }];
  return (
    <div className="page">
      <div className="pg-hero"><div className="pg-hero-inner">
        <div className="eyebrow">Operations</div>
        <h1 className="pgtitle">Live Operations Dashboard</h1>
        <p className="pgdesc">Monitor all active shipments and performance metrics from a single real-time view.</p>
      </div></div>
      <div className="shell">
        <div className="dash-g">
          <div className="dc">
            <div className="dch"><div className="dcht">Active Shipments</div><div className="livebadge"><span className="ldot" />Live</div></div>
            {SHIPMENTS.map(s => (
              <div key={s.id} className="dsr" onClick={() => nav("map")}>
                <div><div className="dsrid">{s.id}</div><div className="dsrr">{s.origin.split(",")[0]} → {s.destination.split(",")[0]} · {s.type}</div></div>
                <div className="dsrright"><span className={`spill ${stClass(s.status)}`} style={{ fontSize: ".67rem", padding: ".15rem .5rem" }}>{stLabel(s.status)}</span><div className="mbar"><div className="mfill" style={{ width: `${s.progress}%` }} /></div><span style={{ fontSize: ".69rem", color: "var(--txt2)" }}>{s.progress}%</span></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div className="dc">
              <div className="dch"><div className="dcht">Performance</div><div className="livebadge"><span className="ldot" />Updated live</div></div>
              {metrics.map((m, i) => (<div key={i} className="mrow"><div className="mtop"><span style={{ color: "var(--txt2)", fontSize: ".79rem" }}>{m.l}</span><span className="mpct" style={{ color: m.c }}>{m.p}%</span></div><div className="mmetbar"><div className="mmetfill" style={{ width: `${m.p}%`, background: m.c }} /></div></div>))}
            </div>
            <div className="dc">
              <div className="dch"><div className="dcht">System Status</div><div className="livebadge"><span className="ldot" />All operational</div></div>
              <div style={{ padding: "1.1rem 1.75rem", display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
                {["GPS Network", "Tracking API", "Customs Link", "Payments", "Support"].map(s => (<span key={s} style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".79rem", color: "#34d399", fontWeight: 600 }}><span style={{ fontSize: ".42rem" }}>●</span>{s}</span>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage({ nav }) {
  return (
    <div className="page">
      <div className="pg-hero"><div className="pg-hero-inner">
        <div className="eyebrow">About Us</div>
        <h1 className="pgtitle">Built for Global Commerce</h1>
        <p className="pgdesc">Since 2008, PrimeShippExpress has been the logistics backbone for thousands of businesses across 158 countries.</p>
      </div></div>
      <div className="shell">
        <div className="about-g">
          <div>
            {[{ ic: "🌐", t: "Global Partner Network", d: "3,200+ carrier partners across air, sea, and road — ensuring coverage in even the most remote regions worldwide." }, { ic: "📡", t: "Real-Time Visibility", d: "GPS tracking, IoT sensors, and AI-powered ETAs give you full shipment visibility 24 hours a day, 7 days a week." }, { ic: "🔐", t: "Secure & Compliant", d: "ISO 9001, IATA, and AEO certified. GDPR and data security built into every process we operate." }, { ic: "🤝", t: "Dedicated Account Managers", d: "Every client gets a real logistics partner — personal support from a named specialist, not a call center." }, { ic: "🌿", t: "Sustainable Logistics", d: "Carbon-neutral shipping options, eco warehouses, and electric last-mile fleets in 30+ cities worldwide." }, { ic: "⚡", t: "Technology-First Platform", d: "Proprietary TMS, real-time API integrations, and predictive analytics keeping your supply chain ahead of disruptions." }].map((f, i) => (
              <div className="afeat" key={i}><div className="afic">{f.ic}</div><div><div className="aft">{f.t}</div><div className="afd">{f.d}</div></div></div>
            ))}
            <button className="hbp" style={{ marginTop: ".75rem" }} onClick={() => nav("contact")}>Partner With Us →</button>
          </div>
          <div>
            <div className="certs-panel">
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.05rem", marginBottom: ".35rem" }}>Accreditations & Certifications</div>
              <div style={{ color: "var(--txt2)", fontSize: ".83rem" }}>Meeting the highest standards for safety and reliability.</div>
              <div className="cert-g">
                {[["🏅", "ISO 9001:2015", "Quality Management"], ["✈️", "IATA Accredited", "Air Cargo Certified"], ["🛡️", "AEO Certified", "Customs Excellence"], ["🌿", "BREEAM Gold", "Eco Warehousing"], ["🔒", "ISO 27001", "Data Security"], ["⭐", "4.9 / 5 Stars", "10,000+ Reviews"]].map(([ic, t, s], i) => (
                  <div className="cert-c" key={i}><div className="cert-ic">{ic}</div><div className="cert-t">{t}</div><div className="cert-s">{s}</div></div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "1.2rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "1.75rem" }}>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, marginBottom: "1rem", fontSize: ".95rem" }}>By the Numbers</div>
              {[["4,000+", "Business clients worldwide"], ["158", "Countries served"], ["3,200+", "Carrier partners"], ["17", "Years in operation"], ["98.7%", "On-time delivery rate"]].map(([v, l], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: ".7rem 0", borderBottom: "1px solid var(--border2)", fontSize: ".86rem" }}><span style={{ color: "var(--txt2)" }}>{l}</span><span style={{ fontWeight: 800, color: "var(--gold)" }}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage({ showToast }) {
  return (
    <div className="page">
      <div className="pg-hero"><div className="pg-hero-inner">
        <div className="eyebrow">Get In Touch</div>
        <h1 className="pgtitle">Request a Quote or Speak to an Expert</h1>
        <p className="pgdesc">Get a custom logistics quote within 2 hours. Our specialists are ready to build the right solution for your business.</p>
      </div></div>
      <div className="shell">
        <div className="contact-g">
          <div>
            <p style={{ color: "var(--txt2)", lineHeight: 1.8, marginBottom: "2.25rem", fontSize: ".93rem" }}>Whether you need a single shipment or a full supply chain partnership, our logistics specialists will design a solution around your exact business requirements.</p>
            {[{ ic: "📞", t: "Phone", d: "+1 (800) 874-2391\nMon–Sun, 06:00–22:00 EST" }, { ic: "✉️", t: "Email", d: "ops@primeshippexpress.com\nAvg. response under 90 minutes" }, { ic: "📍", t: "Headquarters", d: "1 Prime Tower, New York, NY 10004\nUnited States of America" }, { ic: "🌐", t: "Global Offices", d: "London · Dubai · Singapore\nShanghai · São Paulo · Lagos" }].map((c, i) => (
              <div className="cii" key={i}><div className="ciic">{c.ic}</div><div><div className="ciit">{c.t}</div><div className="ciid" style={{ whiteSpace: "pre-line" }}>{c.d}</div></div></div>
            ))}
          </div>
          <div className="cform">
            <div className="crow"><input className="cinput" placeholder="First Name" /><input className="cinput" placeholder="Last Name" /></div>
            <input className="cinput" placeholder="Company / Business Name" />
            <input className="cinput" placeholder="Email Address" type="email" />
            <input className="cinput" placeholder="Phone Number" type="tel" />
            <div className="crow">
              <select className="cselect"><option value="">Service Required</option>{SERVICES.map(s => <option key={s.title}>{s.title}</option>)}<option>Full Supply Chain</option></select>
              <select className="cselect"><option value="">Shipment Volume</option>{["Under 100 kg", "100–500 kg", "500 kg–2 tons", "2–10 tons", "Full Container", "Monthly Contract"].map(v => <option key={v}>{v}</option>)}</select>
            </div>
            <textarea className="ctextarea" placeholder="Describe your shipment — origin, destination, cargo type, timeline, and any special handling requirements..." />
            <button className="csubmit" onClick={() => showToast("✅", "Request Received!", "We'll contact you within 2 hours")}>Send Request →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [trackQ, setTrackQ] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScr] = useState(false);
  const [toast, setToast] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBadge, setChatBadge] = useState(true);

  useEffect(() => {
    const fn = () => setScr(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = (key, q) => {
    if (q !== undefined) setTrackQ(q);
    setPage(key);
    setDrawer(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const showToast = (icon, title, sub) => {
    setToast({ icon, title, sub });
    setTimeout(() => setToast(null), 4000);
  };

  const openChat = () => {
    setChatOpen(true);
    setChatBadge(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="topbar">
        ✈ PrimeShippExpress — Trusted by 4,000+ businesses in 158 countries &nbsp;·&nbsp; 24/7 Support: +1 (800) 874-2391
      </div>

      <header className={`header${scrolled ? " shadow" : ""}`}>
        <div className="hinner">
          <div className="logo" onClick={() => nav("home")}>
            <div className="logo-box">✈</div>
            <div className="logo-words">
              <div className="logo-name">Prime<span>Shipp</span>Express</div>
              <div className="logo-tag">Global Freight Solutions</div>
            </div>
          </div>
          <nav className="nav">
            {NAV_LINKS.map(n => (
              <button key={n.key} className={`nl${page === n.key ? " act" : ""}`} onClick={() => nav(n.key)}>{n.label}</button>
            ))}
          </nav>
          <div className="nright">
            <button className="nbtn-o" onClick={() => nav("track")}>Track</button>
            <button className="nbtn-f" onClick={() => nav("contact")}>Get a Quote</button>
            <button className="hburg" onClick={() => setDrawer(o => !o)}><span /><span /><span /></button>
          </div>
        </div>
      </header>

      {drawer && <div className="drawer-overlay" onClick={() => setDrawer(false)} />}
      <div className={`drawer${drawer ? " open" : ""}`}>
        <button className="drawer-close" onClick={() => setDrawer(false)}>✕</button>
        <div className="drawer-logo">Prime<span>Shipp</span>Express</div>
        {NAV_LINKS.map(n => (
          <button key={n.key} className={`dlink${page === n.key ? " act" : ""}`} onClick={() => nav(n.key)}>{n.label}</button>
        ))}
        <div className="drawer-btns">
          <button className="nbtn-o" style={{ width: "100%", padding: ".65rem" }} onClick={() => nav("track")}>Track Shipment</button>
          <button className="nbtn-f" style={{ width: "100%", padding: ".65rem" }} onClick={() => nav("contact")}>Get a Quote</button>
        </div>
      </div>

      <main key={page}>
        {page === "home" && <HomePage nav={nav} />}
        {page === "services" && <ServicesPage nav={nav} />}
        {page === "track" && <TrackPage initQ={trackQ} />}
        {page === "map" && <MapPage />}
        {page === "dashboard" && <DashboardPage nav={nav} />}
        {page === "about" && <AboutPage nav={nav} />}
        {page === "contact" && <ContactPage showToast={showToast} />}
      </main>

      <footer>
        <div className="ftop">
          <div className="fbrand">
            <div className="logo" onClick={() => nav("home")}>
              <div className="logo-box">✈</div>
              <div className="logo-words">
                <div className="logo-name">Prime<span>Shipp</span>Express</div>
                <div className="logo-tag">Global Freight Solutions</div>
              </div>
            </div>
            <p>Trusted by 4,000+ businesses in 158 countries. Air, sea, and road freight with live tracking and dedicated support.</p>
            <div className="fsoc">{["in", "𝕏", "f", "▶"].map((s, i) => <div key={i} className="fsl">{s}</div>)}</div>
          </div>
          <div className="fcol"><h5>Services</h5><ul>{SERVICES.map(s => <li key={s.title}><a onClick={() => nav("services")}>{s.title}</a></li>)}</ul></div>
          <div className="fcol"><h5>Company</h5><ul>{["About Us", "Careers", "Newsroom", "Partners", "Sustainability"].map(s => <li key={s}><a onClick={() => nav("about")}>{s}</a></li>)}</ul></div>
          <div className="fcol"><h5>Support</h5><ul><li><a onClick={() => nav("track")}>Track a Shipment</a></li><li><a onClick={() => nav("dashboard")}>Dashboard</a></li><li><a onClick={() => nav("contact")}>Contact Support</a></li>{["Help Center", "Privacy Policy", "Terms of Service"].map(s => <li key={s}><a>{s}</a></li>)}</ul></div>
        </div>
        <div className="fbot">
          <div>© 2026 PrimeShippExpress Inc. All rights reserved.</div>
          <div className="fcerts">{["IATA", "ISO 9001", "AEO", "GDPR"].map(c => <span key={c} className="fct">{c}</span>)}</div>
        </div>
      </footer>

      {/* ── CHAT ── */}
      {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}

      <button className="chat-fab" onClick={openChat} title="Chat with Prime AI">
        {chatOpen ? "✕" : "💬"}
        {chatBadge && !chatOpen && <div className="chat-fab-badge">1</div>}
      </button>

      {toast && (
        <div className="toast">
          <span className="t-ic">{toast.icon}</span>
          <div className="t-b"><strong>{toast.title}</strong><span>{toast.sub}</span></div>
        </div>
      )}
    </>
  );
}