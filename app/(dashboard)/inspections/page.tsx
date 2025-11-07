"use client";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile={id:string;email:string;role:"full_admin"|"admin"|"user"};
type Inspection={id:string;title:string|null;started_at:string;completed_at:string|null;state:string};

export default function Inspections(){
  const [p,setP]=useState<Profile|null>(null);
  const [rows,setRows]=useState<Inspection[]>([]);

  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(prof as any);
    const { data } = await supabase.from("inspections").select("*").order("started_at",{ascending:false});
    setRows(data||[]);
  })();},[]);

  async function start(){
    const { data } = await supabase.from("inspections").insert({ title: "New inspection", started_at: new Date().toISOString(), state: "in_progress" }).select("*").single();
    if(data) setRows(r=>[data, ...r]);
  }

  if(!p) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <Topbar email={p.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p.role}/>
        <main className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">Inspections</h1>
          <button className="btn" onClick={start}>Start inspection</button>
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
