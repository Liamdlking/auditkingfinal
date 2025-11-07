"use client";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile={id:string;email:string;role:"full_admin"|"admin"|"user"};
type Inspection={id:string;title:string|null;started_at:string;completed_at:string|null;state:string;template_id:string|null};
type Template={id:string;title:string};

export default function Inspections(){
  const [p,setP]=useState<Profile|null>(null);
  const [rows,setRows]=useState<Inspection[]>([]);
  const [templates,setTemplates]=useState<Template[]>([]);
  const [sel,setSel]=useState("");

  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(prof as any);
    const { data } = await supabase.from("inspections").select("*").order("started_at",{ascending:false});
    setRows(data||[]);
    const { data: t } = await supabase.from("templates").select("id,title").order("title");
    setTemplates(t||[]);
  })();},[]);

  async function start(){
    const template_id = sel || null;
    const { data, error } = await supabase.from("inspections").insert({
      title: template_id ? `Inspection — ${templates.find(t=>t.id===template_id)?.title}` : "New inspection",
      started_at: new Date().toISOString(),
      state: "in_progress",
      template_id
    }).select("*").single();
    if(error){ alert(error.message); return; }

    // (Optional) preload questions from template into inspection_items
    if(template_id){
      const { data: titems } = await supabase.from("template_items").select("*").eq("template_id", template_id);
      if(titems && titems.length){
        const payload = titems.map(it=>({
          inspection_id: data.id,
          question_title: it.title,
          response: null,
          note: null
        }));
        // bulk insert (ignore errors for now)
        await supabase.from("inspection_items").insert(payload);
      }
    }

    if(data) setRows(r=>[data as any, ...r]);
  }

  if(!p) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <Topbar email={p.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p.role}/>
        <main className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">Inspections</h1>
          <div className="flex items-center gap-2">
            <select className="input" value={sel} onChange={e=>setSel(e.target.value)}>
              <option value="">No template</option>
              {templates.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
            <button className="btn" onClick={start}>Start inspection</button>
          </div>
          <ul className="space-y-2">
            {rows.map(i=>(
              <li key={i.id} className="card p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{i.title||"Untitled"}</div>
                  <div className="text-xs text-gray-500">{new Date(i.started_at).toLocaleString()} · {i.state}</div>
                </div>
                <a className="btn-secondary" href={`/api/export/${i.id}`} target="_blank" rel="noreferrer">PDF</a>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}