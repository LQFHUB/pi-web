"use client";

import { useState, useEffect, useCallback } from "react";
// Using system monospace fonts for instant loading
const jb = { variable: '' };
const fc = { variable: '' };

function Svg({ d, size = 14, color }: { d: string; size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: d }} />;
}

const IC = {
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  term: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  spark: '<path d="M9 3L10 6L13 7L10 8L9 11L8 8L5 7L8 6Z"/><path d="M20 16l1 2l2 1l-2 1l-1 2l-1-2l-2-1l2-1Z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  branch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  hash: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  folder: '<path d="M1 3A1 1 0 0 1 2 2H4L5 3.5H8.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-7A.5.5 0 0 1 1 8V3Z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  act: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  thumbs: '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  send: '<line x1="2" y1="7" x2="11" y2="7"/><polyline points="7.5 3 12 7 7.5 11"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  brace: '<path d="M10 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h3"/><path d="M14 3h3a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h0a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-3"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  palette: '<circle cx="13.5" cy="6.5" r="5.5"/><circle cx="5.5" cy="13.5" r="1.5"/><circle cx="14.5" cy="19.5" r="2.5"/><circle cx="20.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="2.5" r="1"/>',
};

const SESSIONS = [
  { t: "Fix auth middleware bug", time: "2m", msgs: 14, active: true, ic: IC.zap, col: "#6b8cff" },
  { t: "Add Redis caching layer", time: "1h", msgs: 32, ic: IC.layers, col: "#2dd4bf" },
  { t: "Refactor API error handling", time: "3h", msgs: 8, ic: IC.branch, col: "#a78bfa", fork: true },
  { t: "Setup CI/CD pipeline", time: "1d", msgs: 45, ic: IC.term, col: "#60a5fa" },
  { t: "Database migration plan", time: "2d", msgs: 22, ic: IC.hash, col: "#f87171" },
  { t: "Docker compose config", time: "4h", msgs: 16, ic: IC.layers, col: "#34d399" },
  { t: "React component library", time: "2d", msgs: 38, ic: IC.code, col: "#f472b6" },
];

export default function Demo() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState<"chat"|"palette"|"type">("chat");
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  const toggle = useCallback(() => setDark(v => !v), []);

  return (
    <div className={`${jb.variable} ${fc.variable}`} style={{height:"100dvh",display:"flex",fontFamily:"var(--font-jb)",fontSize:13,background:"var(--bg)",color:"var(--text)"}}>
      <Styles dark={dark} />
      <Sidebar tab={tab} setTab={setTab} toggle={toggle} dark={dark} />
      <Main tab={tab} setTab={setTab} toggle={toggle} dark={dark} />
    </div>
  );
}

function Sidebar({ tab, setTab, toggle, dark }: any) {
  return (
    <aside style={{width:260,minWidth:260,background:"var(--bg-panel)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 14px 10px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <span className="lg" style={{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,flexShrink:0}}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
              <defs>
                <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--accent)"/><stop offset="100%" stopColor="var(--teal)"/></linearGradient>
                <linearGradient id="lg-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.25)"/><stop offset="50%" stopColor="rgba(255,255,255,0)"/></linearGradient>
                <filter id="lg-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(107,140,255,0.3)"/></filter>
              </defs>
              <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="var(--bg-panel)" stroke="var(--border)" strokeWidth="0.5"/>
              <rect x="2" y="2" width="28" height="28" rx="6.5" fill="url(#lg-bg)" filter="url(#lg-shadow)"/>
              <rect x="2" y="2" width="28" height="28" rx="6.5" fill="url(#lg-shine)"/>
              <text x="16" y="21.5" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="700" fontFamily="var(--font-jb)" style={{letterSpacing:'-0.03em'}}>&pi;</text>
              <rect x="2" y="2" width="28" height="28" rx="6.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
            </svg>
          </span>
          <span style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>Pi Agent</span>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}>
            <span className="dot" /><span style={{fontSize:10,color:"var(--text-dim)"}}>ready</span>
          </div>
        </div>
        <div className="pill" style={{display:"flex",alignItems:"center",gap:7,padding:"5px 9px",background:"var(--bg-subtle)",border:"1px solid var(--border)",borderRadius:8,fontSize:11,color:"var(--text-muted)"}}>
          <Svg d={IC.folder} size={12} color="var(--accent)" />
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>~/projects/my-app</span>
          <Svg d={IC.term} size={10} />
        </div>
      </div>
      <div style={{display:"flex",gap:4,padding:"8px 10px 4px",flexShrink:0}}>
        {[{i:IC.rocket,l:"New",c:"var(--accent)"},{i:IC.search,l:"Find",c:"var(--text-muted)"},{i:IC.star,l:"Stars",c:"var(--text-muted)"}].map(b => (
          <button key={b.l} className="qb" style={{flex:1,height:30,display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:"none",border:"none",borderRadius:7,color:b.c,fontSize:11,cursor:"pointer"}}>
            <Svg d={b.i} size={11} /> {b.l}
          </button>
        ))}
      </div>
      <div style={{padding:"4px 10px 6px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"0 8px",height:28,background:"var(--bg-subtle)",borderRadius:7}}>
          <Svg d={IC.search} size={12} color="var(--text-dim)" />
          <input placeholder="Filter sessions..." style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--text-muted)",fontSize:11,fontFamily:"inherit"}} />
          <kbd style={{fontSize:9,color:"var(--text-dim)",padding:"1px 4px",background:"var(--bg-panel)",borderRadius:3,border:"1px solid var(--border)"}}>&#8984;K</kbd>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"0 6px"}}>
        <div style={{fontSize:10,fontWeight:600,color:"var(--text-dim)",textTransform:"uppercase",letterSpacing:"0.07em",padding:"6px 6px 4px",display:"flex",alignItems:"center",gap:6}}>
          <Svg d={IC.act} size={10} /> Recent
        </div>
        {SESSIONS.map((s:any,i:number) => (
          <div key={i} className={`sit${s.active?" act":""}`} style={{display:"flex",alignItems:"center",gap:8,height:48,padding:"0 8px",marginBottom:1,borderRadius:8,background:s.active?"var(--bg-selected)":"transparent",borderLeft:s.active?"2px solid var(--accent)":"2px solid transparent",cursor:"pointer",animation:`fi 0.3s both`,animationDelay:`${i*0.04}s`}}>
            <div className="sic" style={{width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",background:s.active?`${s.col}18`:"var(--bg-subtle)",color:s.col,flexShrink:0}}>
              <Svg d={s.ic} size={12} color={s.col} />
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="st" style={{fontSize:12,fontWeight:s.active?500:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text)"}}>{s.t}</div>
              <div style={{fontSize:10,color:"var(--text-dim)",marginTop:1,display:"flex",alignItems:"center",gap:8}}>
                <span>{s.time} ago</span>
                <span className="mc" style={{color:s.col}}>{s.msgs} msgs</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"6px 6px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
        {[{i:IC.cpu,l:"Models",b:"4"},{i:IC.layers,l:"Skills",b:"2"},{i:IC.brace,l:"Extensions",b:"new"}].map((item:any) => (
          <button key={item.l} className="fb" style={{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"6px 10px",height:32,background:"none",border:"none",borderRadius:7,color:"var(--text-muted)",fontSize:11,cursor:"pointer",textAlign:"left"}}>
            <Svg d={item.i} size={12} />
            <span style={{flex:1}}>{item.l}</span>
            <span className="fbdg" style={{fontSize:9,padding:"1px 6px",borderRadius:10,background:item.b==="new"?"var(--accent)":"var(--bg-subtle)",color:item.b==="new"?"var(--accent-text)":"var(--text-dim)",fontWeight:item.b==="new"?600:400,border:item.b!=="new"?"1px solid var(--border)":"none"}}>{item.b}</span>
          </button>
        ))}
        <div className="su" style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",marginTop:2,borderRadius:7,cursor:"pointer"}}>
          <div style={{width:22,height:22,borderRadius:6,background:"linear-gradient(135deg,var(--accent),var(--teal))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:600}}>P</div>
          <span style={{fontSize:11,color:"var(--text)",flex:1}}>pi-user</span>
          <Svg d={IC.brace} size={10} color="var(--text-dim)" />
        </div>
      </div>
    </aside>
  );
}

function Main({ tab, setTab, toggle, dark }: any) {
  return (
    <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
      <div style={{height:40,display:"flex",alignItems:"center",background:"var(--bg-panel)",borderBottom:"1px solid var(--border)",flexShrink:0,padding:"0 4px"}}>
        <button className="tb" style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",borderRadius:6,color:"var(--text-muted)",cursor:"pointer"}}>
          <Svg d={IC.brace} size={16} />
        </button>
        {[{id:"chat" as const,i:IC.chat,l:"Chat"},{id:"palette" as const,i:IC.palette,l:"Colors"},{id:"type" as const,i:IC.code,l:"Type"}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{height:"100%",padding:"0 14px",display:"flex",alignItems:"center",gap:6,background:"none",border:"none",borderBottom:tab===t.id?"2px solid var(--accent)":"2px solid transparent",color:tab===t.id?"var(--accent)":"var(--text-muted)",fontSize:12,fontWeight:tab===t.id?600:400,cursor:"pointer"}}>
            <Svg d={t.i} size={13} /> {t.l}
          </button>
        ))}
        <div style={{flex:1}} />
        <div className="sbar" style={{display:"flex",alignItems:"center",gap:10,paddingRight:8,fontSize:11,color:"var(--text-muted)"}}>
          <div className="sg" style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",background:"var(--bg-subtle)",borderRadius:6}}>
            <Svg d={IC.act} size={11} color="var(--teal)" /> 1.2k <span style={{color:"var(--text-dim)"}}>/</span> <Svg d={IC.term} size={11} color="var(--text-dim)" /> 384
          </div>
          <div className="sg" style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",background:"var(--bg-subtle)",borderRadius:6}}>
            <Svg d={IC.cpu} size={11} color="var(--accent)" /> <span style={{color:"var(--accent)",fontWeight:500}}>$0.03</span>
          </div>
          <div className="sg" style={{display:"flex",alignItems:"center",padding:"2px 8px",background:"rgb(251 191 36 / 0.08)",borderRadius:6,color:"var(--warning)"}}>72%</div>
        </div>
        <button onClick={toggle} className="tt" style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",borderRadius:6,color:"var(--text-muted)",cursor:"pointer"}}>
          <Svg d={dark?IC.sun:IC.moon} size={15} />
        </button>
      </div>
      <div style={{flex:1,overflow:"hidden",position:"relative"}}>
        {tab==="chat"&&<Chat />}
        {tab==="palette"&&<Palette />}
        {tab==="type"&&<Type />}
      </div>
    </main>
  );
}

// ─── CHAT ────────────────────────────────────────────────────────────

function Chat() {
  const [vis,setVis]=useState(0);
  useEffect(()=>{const t:any[]=[];for(let i=0;i<5;i++)t.push(setTimeout(()=>setVis(i+1),300+i*350));return ()=>t.forEach(clearTimeout)},[]);
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",flexDirection:"column",gap:20}}>
          {vis>=1&&<Welcome />}
          {vis>=2&&<UserMsg text="Add rate limiting to the auth API with Redis" time="2:31 PM" />}
          {vis>=3&&<Assistant1 />}
          {vis>=4&&<UserMsg text="Also add a 429 response body" time="2:32 PM" />}
          {vis>=5&&<Assistant2 />}
          {vis<5&&vis>0&&<Typing />}
          <div />
        </div>
      </div>
      <Input />
    </div>
  );
}

function Welcome() {
  return <div className="mi"><div className="wc" style={{borderRadius:12,border:"1px solid var(--border)",background:"var(--bg-panel)",overflow:"hidden"}}>
    <div style={{height:4,background:"linear-gradient(90deg,var(--accent),var(--teal),var(--accent))",backgroundSize:"200% 100%",animation:"sh 3s linear infinite"}} />
    <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div className="wi" style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,var(--accent),var(--teal))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>
        <Svg d={IC.spark} size={18} />
      </div>
      <div><div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2}}>Ready to build! 🚀</div><div style={{fontSize:11,color:"var(--text-muted)"}}>What are we working on today?</div></div>
    </div>
  </div></div>;
}

function UserMsg({text,time}:{text:string;time:string}) {
  return <div className="mi"><div style={{display:"flex",justifyContent:"flex-end"}}>
    <div className="ub" style={{maxWidth:"80%",background:"var(--user-bg)",border:"1px solid var(--user-border)",borderRadius:12,padding:"10px 14px",fontSize:13,lineHeight:1.65,color:"var(--text)"}}>{text}</div>
  </div>
  <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginTop:3,paddingRight:4}}>
    <div className="ua" style={{display:"flex",gap:3}}><Svg d={IC.copy} size={10} color="var(--text-dim)" /><Svg d={IC.star} size={10} color="var(--text-dim)" /></div>
    <span style={{fontSize:10,color:"var(--text-dim)"}}>{time}</span>
  </div></div>;
}

function Assistant1() {
  return <div className="mi" style={{animationDelay:"0.1s"}}>
    <div style={{fontSize:11,color:"var(--text-dim)",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
      <div className="ma" style={{width:18,height:18,borderRadius:5,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-text)",fontSize:9,fontWeight:700}}>C</div>
      <span className="mb" style={{fontWeight:600,color:"var(--accent)"}}>Claude Sonnet 4</span>
      <span className="ms" style={{background:"var(--bg-subtle)",padding:"1px 6px",borderRadius:4,fontSize:10,display:"flex",alignItems:"center",gap:4}}>
        <Svg d={IC.act} size={9} color="var(--teal)" /> 1.2k <span style={{color:"var(--text-dim)",margin:"0 2px"}}>·</span> <Svg d={IC.clock} size={9} color="var(--text-dim)" /> 2.4s
      </span>
      <span className="msts" style={{display:"flex",alignItems:"center",gap:3,marginLeft:"auto"}}>
        <span className="td" /><span className="td" style={{animationDelay:"0.15s"}} /><span className="td" style={{animationDelay:"0.3s"}} />
      </span>
    </div>
    <div style={{fontSize:13,lineHeight:1.7,color:"var(--text)"}}>
      <p className="pin" style={{margin:"0 0 10px"}}>I'll add Redis-based rate limiting. Here's the plan:</p>
      <ol className="pin" style={{paddingLeft:18,margin:"0 0 10px"}}>
        <li style={{marginBottom:3}}>Create a <InlineC>rate-limiter.ts</InlineC> middleware</li>
        <li style={{marginBottom:3}}>Add Redis config for dev/prod</li>
        <li style={{marginBottom:3}}>Apply to <InlineC>/api/auth/*</InlineC> routes</li>
      </ol>
    </div>
    <CB fn="rate-limiter.ts" code={`import Redis from 'ioredis';\n\nexport async function rateLimit(\n  ip: string,\n  { max = 100, window = 60 }: { max?: number; window?: number } = {}\n) {\n  const key = \`ratelimit:$\{ip}\`;\n  const count = await redis.incr(key);\n  if (count === 1) redis.expire(key, window);\n  return { allowed: count <= max, remaining: max - count };\n}`} />
    <TC tool="write" path="src/middleware/rate-limiter.ts" dur="1.2s" />
    <TB dur="3.8s" />
  </div>;
}

function Assistant2() {
  return <div className="mi" style={{animationDelay:"0.1s"}}>
    <div style={{fontSize:11,color:"var(--text-dim)",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
      <div className="ma" style={{width:18,height:18,borderRadius:5,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-text)",fontSize:9,fontWeight:700}}>C</div>
      <span style={{fontWeight:600,color:"var(--accent)"}}>Claude Sonnet 4</span>
      <span style={{background:"var(--bg-subtle)",padding:"1px 6px",borderRadius:4,fontSize:10,display:"flex",alignItems:"center",gap:4}}>
        <Svg d={IC.thumbs} size={9} color="var(--success)" /> Good
      </span>
    </div>
    <div style={{fontSize:13,lineHeight:1.7,color:"var(--text)"}}>
      <p className="pin" style={{margin:"0 0 10px"}}>Good call! Standard 429 should include a <InlineC>Retry-After</InlineC> header. Updated to return:</p>
    </div>
    <CB fn="json" code={`{\n  "error": "too_many_requests",\n  "message": "Rate limit exceeded. Try again in 60s.",\n  "retry_after": 60\n}`} />
    <div className="pin" style={{display:"flex",gap:6,marginTop:8}}>
      {["Deploy this","Add tests","Explain more"].map(a => (
        <button key={a} className="sbtn" style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",height:28,background:"var(--bg-subtle)",border:"1px solid var(--border)",borderRadius:20,color:"var(--text-muted)",cursor:"pointer",fontSize:11}}>
          <Svg d={IC.zap} size={10} /> {a}
        </button>
      ))}
    </div>
  </div>;
}

function InlineC({children}:{children:string}) {
  return <code style={{background:"var(--bg-subtle)",padding:"1px 5px",borderRadius:4,fontSize:"0.9em",fontFamily:"var(--font-fc)",color:"var(--code-func)",border:"1px solid var(--border)"}}>{children}</code>;
}

function CB({fn,code}:{fn:string;code:string}) {
  return <div className="ce" style={{marginTop:8,marginBottom:10}}>
    <div style={{borderRadius:10,overflow:"hidden",border:"1px solid var(--border)",background:"var(--code-bg)"}}>
      <div className="ch" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 12px",background:"var(--bg-panel)",borderBottom:"1px solid var(--border)",fontSize:11,color:"var(--text-dim)"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><Svg d={IC.file} size={11} color="var(--accent)" /> <span>{fn}</span></div>
        <div style={{display:"flex",gap:4}}>
          <button className="cab" style={{background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",padding:"2px 6px",borderRadius:4,fontSize:11,display:"flex",alignItems:"center",gap:4}}><Svg d={IC.copy} size={11} /> Copy</button>
          <button className="cab" style={{background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",padding:"2px 6px",borderRadius:4,fontSize:11}}><Svg d={IC.thumbs} size={11} /></button>
        </div>
      </div>
      <pre style={{margin:0,padding:"14px 16px",fontSize:12,lineHeight:1.7,fontFamily:"var(--font-fc)",color:"var(--code-text)",overflow:"auto"}}>
        <SH code={code} />
      </pre>
    </div>
  </div>;
}

function SH({code}:{code:string}) {
  const parts = code.split(/(\b(?:import|export|async|function|const|let|var|if|else|return|from|await|true|false|null)\b|'[^']*'|`[^`]*`|"[^"]*"|\.\w+|\d+|[{}()[\];:,])/g);
  return <>{parts.map((t,i)=>{
    if(/^(import|export|async|function|const|let|var|if|else|return|from|await|true|false|null)$/.test(t)) return <span key={i} style={{color:"var(--code-keyword)"}}>{t}</span>;
    if(/^(['"`]).*\1$/.test(t)) return <span key={i} style={{color:"var(--code-string)"}}>{t}</span>;
    if(/^\d+$/.test(t)) return <span key={i} style={{color:"var(--code-number)"}}>{t}</span>;
    if(/^\.\w+$/.test(t)) return <span key={i} style={{color:"var(--code-func)"}}>{t}</span>;
    return <span key={i}>{t}</span>;
  })}</>;
}

function TC({tool,path,dur}:{tool:string;path:string;dur:string}) {
  return <div className="tce" style={{marginTop:6,marginBottom:6}}>
    <div style={{borderRadius:8,overflow:"hidden",border:"1px solid var(--tool-border)",background:"var(--tool-bg)"}}>
      <button className="tch" style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 12px",background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",fontSize:12,textAlign:"left"}}>
        <div className="tci" style={{width:18,height:18,borderRadius:5,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Svg d={IC.tool} size={10} color="var(--accent-text)" />
        </div>
        <span style={{color:"var(--accent)",fontWeight:600,fontFamily:"var(--font-fc)"}}>{tool}</span>
        <span style={{color:"var(--text-dim)",fontFamily:"var(--font-fc)",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{path}</span>
        <span className="tcd" style={{marginLeft:"auto",fontSize:11,color:"var(--text-dim)",display:"flex",alignItems:"center",gap:4}}><Svg d={IC.clock} size={9} /> {dur}</span>
        <Svg d={IC.zap} size={10} color="var(--accent)" />
      </button>
    </div>
  </div>;
}

function TB({dur}:{dur:string}) {
  return <div className="tce" style={{marginTop:4}}>
    <div className="tbk" style={{borderRadius:8,overflow:"hidden",border:"1px solid var(--border)"}}>
      <button style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 12px",background:"var(--bg-panel)",border:"none",color:"var(--text-muted)",cursor:"pointer",fontSize:12,textAlign:"left"}}>
        <span className="tbo" style={{width:7,height:7,borderRadius:"50%",background:"var(--text-dim)",flexShrink:0}} />
        <span>Thinking</span>
        <span className="tcd" style={{marginLeft:"auto",fontSize:11,color:"var(--text-dim)",display:"flex",alignItems:"center",gap:4}}><Svg d={IC.clock} size={9} /> {dur}</span>
      </button>
    </div>
  </div>;
}

function Typing() {
  return <div className="ty" style={{display:"flex",alignItems:"center",gap:8,padding:"6px 4px"}}>
    <div style={{width:22,height:22,borderRadius:6,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-text)",fontSize:9,fontWeight:700}}>C</div>
    <div style={{display:"flex",gap:4}}><span className="td" /><span className="td" style={{animationDelay:"0.15s"}} /><span className="td" style={{animationDelay:"0.3s"}} /></div>
  </div>;
}

function Input() {
  return <div style={{padding:"0 24px 14px",flexShrink:0}}>
    <div style={{maxWidth:780,margin:"0 auto"}}>
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        {["image-1.png","screenshot.jpg"].map((n,i)=><div key={i} className="ach" style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",background:"var(--bg-subtle)",border:"1px solid var(--border)",borderRadius:6,fontSize:10,color:"var(--text-muted)",cursor:"pointer"}}>
          <Svg d={IC.file} size={10} color="var(--accent)" /> {n} <span style={{color:"var(--text-dim)"}}>&times;</span>
        </div>)}
      </div>
      <div className="ibx" style={{display:"flex",gap:8,alignItems:"flex-end",background:"var(--input-bg)",border:"1px solid var(--input-border)",borderRadius:14,padding:"8px 8px 8px 16px",boxShadow:"var(--input-shadow)"}}>
        <div style={{display:"flex",gap:2,alignSelf:"center"}}>
          <button className="ibtn" style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",borderRadius:6,color:"var(--text-dim)",cursor:"pointer"}}><Svg d={IC.spark} size={13} /></button>
          <button className="ibtn" style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",borderRadius:6,color:"var(--text-dim)",cursor:"pointer"}}><Svg d={IC.folder} size={13} /></button>
        </div>
        <textarea placeholder="Message... (&#8984;+Enter)" rows={1} style={{flex:1,background:"none",border:"none",outline:"none",resize:"none",color:"var(--text)",fontSize:13,lineHeight:1.6,fontFamily:"inherit",minHeight:28,maxHeight:160}} />
        <div style={{display:"flex",gap:4,alignSelf:"flex-end"}}>
          <button className="ibtn" style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",borderRadius:6,color:"var(--text-dim)",cursor:"pointer"}}><Svg d={IC.music} size={13} /></button>
          <button className="sb" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"6px 14px",height:28,background:"var(--accent)",border:"none",borderRadius:7,color:"var(--accent-text)",fontSize:12,fontWeight:600,cursor:"pointer"}}><Svg d={IC.send} size={12} /> Send</button>
        </div>
      </div>
      <div style={{marginTop:8,display:"flex",alignItems:"center",gap:1,fontSize:11,color:"var(--text-muted)"}}>
        <button className="icb act" style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",height:26,background:"var(--bg-subtle)",border:"1px solid var(--border)",borderRadius:6,color:"var(--text)",cursor:"pointer",fontSize:11}}>
          <Svg d={IC.cpu} size={11} color="var(--accent)" /> Claude Sonnet 4
        </button>
        <button className="icb" style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",height:26,background:"none",border:"1px solid var(--border)",borderRadius:6,color:"var(--text-muted)",cursor:"pointer",fontSize:11}}>
          <Svg d={IC.tool} size={10} /> tools
        </button>
        <button className="icb" style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",height:26,background:"none",border:"1px solid var(--border)",borderRadius:6,color:"var(--text-muted)",cursor:"pointer",fontSize:11}}>
          <Svg d={IC.layers} size={10} /> compact
        </button>
        <button className="icb" style={{display:"flex",alignItems:"center",justifyContent:"center",width:26,height:26,background:"none",border:"1px solid var(--border)",borderRadius:6,cursor:"pointer",marginLeft:"auto",color:"var(--text-dim)"}}>
          <Svg d={IC.music} size={11} />
        </button>
        <span style={{padding:"4px 8px",display:"flex",alignItems:"center",gap:8,fontVariantNumeric:"tabular-nums",color:"var(--text-dim)"}}>
          <span>1.2k</span>
          <span style={{color:"var(--accent)",fontWeight:500}}>$0.03</span>
          <span style={{color:"var(--warning)"}}>72%</span>
        </span>
      </div>
    </div>
  </div>;
}

// ─── PALETTE ──────────────────────────────────────────────────────────

function Palette() {
  const ui = [
    {n:"--bg",v:"var(--bg)",d:"Page"},{n:"--bg-panel",v:"var(--bg-panel)",d:"Panels"},{n:"--bg-hover",v:"var(--bg-hover)",d:"Hover"},{n:"--bg-selected",v:"var(--bg-selected)",d:"Selected"},{n:"--bg-subtle",v:"var(--bg-subtle)",d:"Subtle"},{n:"--border",v:"var(--border)",d:"Borders"},{n:"--text",v:"var(--text)",d:"Primary"},{n:"--text-muted",v:"var(--text-muted)",d:"Muted"},{n:"--text-dim",v:"var(--text-dim)",d:"Dim"},{n:"--accent",v:"var(--accent)",d:"Accent"},{n:"--user-bg",v:"var(--user-bg)",d:"User"},{n:"--code-bg",v:"var(--code-bg)",d:"Code"}
  ];
  const sx = [
    {n:"keyword",v:"var(--code-keyword)",d:"Keywords"},{n:"string",v:"var(--code-string)",d:"Strings"},{n:"number",v:"var(--code-number)",d:"Numbers"},{n:"func",v:"var(--code-func)",d:"Functions"},{n:"type",v:"var(--code-type)",d:"Types"},{n:"comment",v:"var(--code-comment)",d:"Comments"}
  ];
  const sem = [
    {l:"Accent",b:"var(--accent)",c:"var(--accent-text)",i:IC.star},{l:"Success",b:"var(--success)",c:"#111",i:IC.thumbs},{l:"Error",b:"var(--error)",c:"#fff",i:IC.zap},{l:"Warning",b:"var(--warning)",c:"#111",i:IC.term},{l:"Teal",b:"var(--teal)",c:"#111",i:IC.act}
  ];
  return <div style={{height:"100%",overflow:"auto",padding:"28px 32px"}}>
    <div className="pin" style={{maxWidth:800}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,var(--accent),var(--teal))",display:"flex",alignItems:"center",justifyContent:"center"}}><Svg d={IC.palette} size={16} color="#fff" /></div>
        <h2 style={{fontSize:18,fontWeight:600,color:"var(--text)"}}>Color Palette</h2>
      </div>
      <p style={{fontSize:12,color:"var(--text-muted)",marginBottom:24}}>Neutral dark/light &middot; Warm amber accent &middot; Vibrant semantic colors</p>
      <div style={{marginBottom:28}}>
        <h3 style={{fontSize:11,fontWeight:600,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,display:"flex",alignItems:"center",gap:6}}><Svg d={IC.target} size={11} color="var(--accent)" /> UI Colors</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8}}>
          {ui.map((s:any,i:number)=><div key={s.n} className="sw" style={{borderRadius:8,overflow:"hidden",border:"1px solid var(--border)",background:"var(--bg-panel)",animation:`fi 0.3s both`,animationDelay:`${i*0.03}s`}}>
            <div style={{height:40,background:s.v}} /><div style={{padding:"5px 8px"}}><div style={{fontSize:10,fontWeight:600,color:"var(--text)",fontFamily:"var(--font-jb)"}}>{s.n}</div><div style={{fontSize:9,color:"var(--text-dim)"}}>{s.d}</div></div>
          </div>)}
        </div>
      </div>
      <div style={{marginBottom:28}}>
        <h3 style={{fontSize:11,fontWeight:600,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,display:"flex",alignItems:"center",gap:6}}><Svg d={IC.target} size={11} color="var(--accent)" /> Syntax</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
          {sx.map((s:any,i:number)=><div key={s.n} className="sw" style={{borderRadius:8,overflow:"hidden",border:"1px solid var(--border)",background:"var(--code-bg)",animation:`fi 0.3s both`,animationDelay:`${i*0.03}s`}}>
            <div style={{height:40,background:s.v}} /><div style={{padding:"5px 8px"}}><div style={{fontSize:10,fontWeight:600,color:"var(--text)",fontFamily:"var(--font-jb)"}}>{s.n}</div><div style={{fontSize:9,color:"var(--text-dim)"}}>{s.d}</div></div>
          </div>)}
        </div>
      </div>
      <h3 style={{fontSize:11,fontWeight:600,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Svg d={IC.zap} size={11} color="var(--accent)" /> Semantic</h3>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
        {sem.map((v:any,i:number)=><div key={v.l} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:8,background:v.b,color:v.c,fontSize:12,fontWeight:600,animation:`fi 0.3s both`,animationDelay:`${i*0.05}s`}}>
          <Svg d={v.i} size={12} /> {v.l}
        </div>)}
      </div>
    </div>
  </div>;
}

// ─── TYPE ────────────────────────────────────────────────────────────

function Type() {
  const samples = [
    {s:28,w:700,l:"Display",t:"Pi Agent Web",ls:"-0.03em"},{s:18,w:600,l:"Heading",t:"Fix auth middleware bug"},{s:15,w:500,l:"Subtitle",t:"Session settings & configuration"},{s:13,w:400,l:"Body",t:"The quick brown fox jumps over the lazy dog."},{s:12,w:400,l:"Mono",t:"import { rateLimit } from './middleware';",ff:"var(--font-fc)"},{s:11,w:400,l:"Caption",t:"Created 2 hours ago &middot; 14 messages"},{s:10,w:600,l:"Label",t:"SESSIONS &middot; EXPLORER",ls:"0.08em",tt:"uppercase"},
  ];
  return <div style={{height:"100%",overflow:"auto",padding:"28px 32px"}}>
    <div className="pin" style={{maxWidth:800}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,var(--accent),var(--teal))",display:"flex",alignItems:"center",justifyContent:"center"}}><Svg d={IC.code} size={16} color="#fff" /></div>
        <h2 style={{fontSize:18,fontWeight:600,color:"var(--text)"}}>Typography</h2>
      </div>
      <p style={{fontSize:12,color:"var(--text-muted)",marginBottom:24}}><strong>JetBrains Mono</strong> &mdash; UI &middot; <strong>Fira Code</strong> &mdash; code with ligatures</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
        {[{n:"JetBrains Mono",v:"var(--font-jb)",ch:"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&*()",i:IC.code},{n:"Fira Code",v:"var(--font-fc)",ch:"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !=> -> :: => <!--",i:IC.term}].map((f:any,i:number)=><div key={f.n} className="fc" style={{borderRadius:8,border:"1px solid var(--border)",background:"var(--bg-panel)",padding:16,animation:`fi 0.3s both`,animationDelay:`${i*0.08}s`}}>
          <div style={{fontSize:11,fontWeight:600,color:"var(--accent)",marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Svg d={f.i} size={12} color="var(--accent)" /> {f.n}</div>
          <div style={{fontSize:13,fontFamily:f.v,color:"var(--text)",lineHeight:1.7,wordBreak:"break-all"}}>{f.ch}</div>
        </div>)}
      </div>
      <h3 style={{fontSize:11,fontWeight:600,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Svg d={IC.layers} size={11} color="var(--accent)" /> Type Scale</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {samples.map((s:any,i:number)=><div key={i} className="tr" style={{display:"flex",alignItems:"baseline",gap:16,padding:"4px 8px 10px",borderBottom:"1px solid var(--border)",borderRadius:6,animation:`fi 0.3s both`,animationDelay:`${i*0.05}s`}}>
          <div style={{minWidth:70,fontSize:11,color:"var(--text-dim)",fontFamily:"var(--font-jb)",display:"flex",alignItems:"center",gap:4}}><Svg d={IC.target} size={8} color="var(--text-dim)" /> {s.l} <span style={{opacity:0.4}}>{s.s}</span></div>
          <div style={{fontSize:s.s,fontWeight:s.w,fontFamily:s.ff||"var(--font-jb)",color:"var(--text)",letterSpacing:s.ls,textTransform:s.tt}} dangerouslySetInnerHTML={{__html:s.t}} />
        </div>)}
      </div>
    </div>
  </div>;
}

// ─── STYLES ──────────────────────────────────────────────────────────

function Styles({dark}:{dark:boolean}) {
  const c=(d:string,l:string)=>dark?d:l;
  const s=`
:root {
  --bg:${c("#08080a","#fff")};--bg-panel:${c("#111113","#f6f6f6")};
  --bg-hover:${c("#19191d","#eee")};--bg-selected:${c("#202024","#e5e5e5")};
  --bg-subtle:${c("rgba(255,255,255,0.035)","rgba(0,0,0,0.03)")};
  --border:${c("#1d1d21","#e8e8e8")};--text:${c("#e4e4e4","#111")};
  --text-muted:${c("#787878","#6b6b6b")};--text-dim:${c("#484848","#9e9e9e")};
  --accent:${c("#6b8cff","#4a6cf7")};--accent-hover:${c("#8ba6ff","#6b8cff")};
  --accent-text:${c("#fff","#fff")};--success:${c("#4ade80","#16a34a")};
  --error:${c("#f87171","#dc2626")};--warning:${c("#fbbf24","#d97706")};
  --teal:${c("#2dd4bf","#0d9488")};
  --user-bg:${c("#14151f","#f0f2ff")};--user-border:${c("rgba(107,140,255,0.15)","rgba(74,108,247,0.15)")};
  --tool-bg:${c("rgba(45,212,191,0.04)","rgba(13,148,136,0.04)")};--tool-border:${c("rgba(45,212,191,0.15)","rgba(13,148,136,0.15)")};
  --input-bg:${c("#08080a","#fff")};--input-border:${c("rgba(255,255,255,0.07)","rgba(0,0,0,0.06)")};
  --input-shadow:${c("0 2px 8px rgba(0,0,0,0.3)","0 2px 8px rgba(0,0,0,0.04)")};
  --code-bg:${c("#0c0c12","#f7f7f7")};--code-text:${c("#d0d0d0","#2d2d2d")};
  --code-keyword:${c("#6b8cff","#4a6cf7")};--code-string:${c("#7ecf9a","#2d8040")};
  --code-number:${c("#d19a66","#c06014")};--code-func:${c("#61afef","#2563a4")};
  --code-type:${c("#c678dd","#8b3a9e")};--code-comment:${c("#585858","#9e9e9e")};
  --font-jb:'SF Mono','Fira Code','JetBrains Mono',monospace;
  --font-fc:'Fira Code','JetBrains Mono','SF Mono',monospace;
  scrollbar-color:var(--border) transparent;
}
*{box-sizing:border-box}
pre,code{font-family:var(--font-fc),'Fira Code',monospace;font-variant-ligatures:contextual}
body,button,input,textarea{font-family:var(--font-jb),'JetBrains Mono',monospace}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

@keyframes fi{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
@keyframes si{0%{opacity:0;transform:scale(0.95)}100%{opacity:1;transform:scale(1)}}
@keyframes su{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
@keyframes ts{0%{opacity:0;transform:translateX(-6px) scale(0.97)}100%{opacity:1;transform:translateX(0) scale(1)}}
@keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes bd{0%,80%,100%{transform:translateY(0);opacity:0.3}40%{transform:translateY(-5px);opacity:1}}
@keyframes pg{0%,100%{box-shadow:0 0 0 0 rgba(107,140,255,0)}50%{box-shadow:0 0 14px 2px rgba(107,140,255,0.15)}}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes td{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.8;transform:scale(1.3)}}
@keyframes sp{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
@keyframes wg{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}

.mi{animation:su 0.4s cubic-bezier(0.16,1,0.3,1) both}
.pin{animation:su 0.3s ease both}
.ce{animation:si 0.35s cubic-bezier(0.16,1,0.3,1) both}
.tce{animation:ts 0.3s ease both}
.td{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);animation:bd 1.2s ease-in-out infinite}
.ty .td{width:7px;height:7px}
.dot{width:6px;height:6px;border-radius:50%;display:inline-block;background:var(--success);box-shadow:0 0 6px rgba(74,222,128,0.4);animation:pg 2s ease-in-out infinite}
.lg{display:inline-block;animation:fl 2.8s ease-in-out infinite}
.tbo{animation:td 1.5s ease-in-out infinite}
.mb::after{content:'';display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--success);margin-left:5px;vertical-align:middle;animation:bd 1.8s ease-in-out infinite}

.sit:hover{background:var(--bg-hover)!important;transform:translateX(3px)}
.sit.act{animation:pg 2.5s ease-in-out 1}
.sit:hover .sic{transform:scale(1.1)}
.sic{transition:transform 0.15s}
.st{transition:color 0.12s}
.sit:hover .st{color:var(--accent)!important}
.mc{transition:opacity 0.12s}
.sit:hover .mc{opacity:0.7}

.tb:hover{background:var(--bg-hover)!important;color:var(--text)!important}
.ibtn:hover{background:var(--bg-hover)!important;color:var(--text)!important}
.ibx:focus-within{border-color:var(--accent)!important;box-shadow:0 2px 16px rgba(107,140,255,0.10)!important}
.sb:hover{background:var(--accent-hover)!important;transform:scale(1.02);box-shadow:0 2px 10px rgba(107,140,255,0.30)}
.sb:active{transform:scale(0.96)}
.tt:hover{transform:rotate(20deg) scale(1.1)}
.tt{transition:transform 0.15s}
.icb:hover{background:var(--bg-hover)!important;color:var(--text)!important}
.icb.act{background:var(--bg-subtle);color:var(--text);border-color:var(--accent)}
.icb:active{transform:scale(0.97)}

.sw{transition:transform 0.2s,box-shadow 0.2s}
.sw:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.08)}
.sw:hover>div:first-child{filter:brightness(1.1)}
.fc{transition:transform 0.2s,box-shadow 0.2s}
.fc:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.08)}
.tr:hover{background:var(--bg-subtle);padding-left:12px!important;cursor:default}
.ub{transition:transform 0.15s}
.ub:hover{transform:scale(1.003)}
.tch:hover{background:var(--bg-hover)!important}
.tch:hover .tci{animation:sp 0.6s ease}
.tbk:hover{border-color:var(--text-muted)}
.qb:hover{background:var(--bg-hover)!important;color:var(--accent)!important}
.qb:hover svg{animation:wg 0.3s ease}
.fb:hover{background:var(--bg-hover)!important;color:var(--text)!important}
.fb:hover .fbdg{background:var(--accent);color:var(--accent-text);border:none}
.su:hover{background:var(--bg-hover)}
.ch{transition:background 0.12s}
.cab{opacity:0.5;transition:opacity 0.12s,background 0.12s,color 0.12s}
.ch:hover .cab{opacity:1}
.cab:hover{background:var(--bg-hover)!important;color:var(--accent)!important}
.wi{transition:transform 0.2s}
.wc:hover .wi{transform:scale(1.1) rotate(-5deg)}
.wc{transition:transform 0.15s,box-shadow 0.15s}
.wc:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.06)}
.ach:hover{background:var(--bg-hover);border-color:var(--accent);color:var(--text)}
.ua{opacity:0;transition:opacity 0.12s}
.ua:hover{opacity:1!important}
.ua svg{transition:color 0.12s}
.ua svg:hover{color:var(--accent)}
.sbtn{transition:all 0.12s}
.sbtn:hover{transform:translateY(-1px);background:var(--bg-hover);border-color:var(--accent);color:var(--accent)}
.ma{transition:transform 0.15s}
.ma:hover{transform:scale(1.15) rotate(-5deg)}
.msts .td:nth-child(2){animation-delay:0.15s}
.msts .td:nth-child(3){animation-delay:0.3s}
.pill:hover{border-color:var(--accent);background:var(--bg-hover)}
`;
  return <style dangerouslySetInnerHTML={{__html:s}} />;
}
