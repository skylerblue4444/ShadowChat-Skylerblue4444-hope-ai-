import { useState } from "react";
import { Lock, Shield, AlertTriangle, CheckCircle2, Eye, EyeOff, Smartphone, Globe, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SESSIONS = [
  {id:"s1",device:"Chrome · macOS",location:"New York, US",ip:"192.168.1.1",current:true,time:"Now"},
  {id:"s2",device:"Safari · iPhone",location:"New York, US",ip:"192.168.1.2",current:false,time:"2h ago"},
  {id:"s3",device:"Firefox · Windows",location:"Los Angeles, US",ip:"10.0.0.1",current:false,time:"1d ago"},
];
const THREATS = [
  {id:"t1",type:"Blocked Login",severity:"high",msg:"TOR exit node login attempt blocked",time:"12m ago"},
  {id:"t2",type:"Rate Limit",severity:"medium",msg:"API rate limit triggered from 203.0.113.1",time:"1h ago"},
  {id:"t3",type:"Scan Detected",severity:"low",msg:"Port scan detected from 198.51.100.1",time:"3h ago"},
];

export default function SecurityCenter() {
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  return (
    <div className="p-5 max-w-[1000px] space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Security Center</h1>
        <p className="text-[11px] text-white/40">Apple ID security × Enterprise privacy dashboard · All clear</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"Security Score",value:"98/100",icon:Shield,color:"green"},
          {label:"Threats Blocked",value:"1,247",icon:AlertTriangle,color:"amber"},
          {label:"Active Sessions",value:"3",icon:Globe,color:"cyan"},
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="text-[10px] text-white/40 mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 space-y-3">
        <h3 className="text-[13px] font-semibold text-white">Security Settings</h3>
        {[
          {label:"Two-Factor Authentication",desc:"TOTP app required for all logins",state:twoFA,set:setTwoFA},
          {label:"Biometric Login",desc:"Use fingerprint or Face ID",state:biometric,set:setBiometric},
          {label:"Privacy Mode",desc:"Hide balance and activity from public",state:privacyMode,set:setPrivacyMode},
        ].map(s=>(
          <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div>
              <div className="text-[12px] font-semibold text-white">{s.label}</div>
              <div className="text-[10px] text-white/40">{s.desc}</div>
            </div>
            <button onClick={()=>{s.set((p:boolean)=>!p);toast.success(`${s.label} ${!s.state?"enabled":"disabled"}`);}}
              className={cn("w-10 h-5 rounded-full transition-all relative",s.state?"bg-cyan-500":"bg-white/[0.12]")}>
              <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",s.state?"left-5":"left-0.5")}/>
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
        <h3 className="text-[13px] font-semibold text-white mb-3">Active Sessions</h3>
        <div className="space-y-2">
          {SESSIONS.map(s=>(
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-white/40"/>
                <div>
                  <div className="text-[12px] font-semibold text-white">{s.device}</div>
                  <div className="text-[10px] text-white/40">{s.location} · {s.ip} · {s.time}</div>
                </div>
              </div>
              {s.current?<span className="text-[10px] text-green-400 font-mono">CURRENT</span>:
                <button onClick={()=>toast.success("Session revoked")} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Revoke</button>}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <h3 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400"/> Recent Threats</h3>
        <div className="space-y-2">
          {THREATS.map(t=>(
            <div key={t.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.03]">
              <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0",t.severity==="high"?"bg-red-400":t.severity==="medium"?"bg-amber-400":"bg-yellow-400")}/>
              <div>
                <div className="text-[11px] font-semibold text-white">{t.type}</div>
                <div className="text-[10px] text-white/50">{t.msg}</div>
                <div className="text-[9px] text-white/30 mt-0.5">{t.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
