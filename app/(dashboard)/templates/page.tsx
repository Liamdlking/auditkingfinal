"use client";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Profile={id:string;email:string;role:"full_admin"|"admin"|"user"};
type Template={id:string;title:string;site_id:string|null};

export default function Templates(){
  const [p,setP]=useState<Profile|null>(null);
  const [rows,setRows]=useState<Template[]>([]);
  const [title,setTitle]=useState("");

  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(prof as any);
    await load();
  })();},[]);

  async function load(){
    const { data } = await supabase.from("templates").select("*").order("title");
    setRows(data||[]);
  }

  async function add(){
    if(!title.trim()) return;
    const { data, error } = await supabase.from("templates").insert({ title, site_id: null }).select("*").single();
    if(error){ alert(error.message); return; }
    if(data) setRows(r=>[...r, data]);
    setTitle("");
  }

  if(!p) return <div className="p-8">Loading...</div>;
  const isAdmin = p.role==="full_admin" || p.role==="admin";

  return (
    <div>
      <Topbar email={p.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p.role}/>
        <main className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">Templates</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <input className="input" placeholder="New template title" value={title} onChange={e=>setTitle(e.target.value)}/>
              <button className="btn" onClick={add}>Add</button>
            </div>
          )}
          <ul className="grid sm:grid-cols-2 gap-2">
            {rows.map(t=>(
              <li key={t.id} className="card p-3 flex items-center justify-between">
                <div>{t.title}</div>
                {isAdmin ? (
                  <Link className="btn-secondary" href={`/templates/${t.id}`}>Open builder</Link>
                ) : (
                  <span className="text-xs text-gray-500">View only</span>
                )}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
} 