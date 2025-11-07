"use client";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile={id:string;email:string;role:"full_admin"|"admin"|"user"};
type Site={id:string;name:string};

export default function Sites(){
  const [p,setP]=useState<Profile|null>(null);
  const [rows,setRows]=useState<Site[]>([]);
  const [name,setName]=useState("");

  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(prof as any);
    const { data } = await supabase.from("sites").select("*").order("name");
    setRows(data||[]);
  })();},[]);

  async function add(){
    if(!name.trim()) return;
    const { data } = await supabase.from("sites").insert({ name }).select("*").single();
    if(data) setRows(r=>[...r, data]);
    setName("");
  }

  if(!p) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <Topbar email={p.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p.role}/>
        <main className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">Sites</h1>
          <div className="flex gap-2">
            <input className="input" placeholder="New site name" value={name} onChange={e=>setName(e.target.value)}/>
            <button className="btn" onClick={add}>Add</button>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2">
            {rows.map(s=>(<li key={s.id} className="card p-3">{s.name}</li>))}
          </ul>
        </main>
      </div>
    </div>
  );
}
