"use client";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

type Profile={id:string;email:string;role:"full_admin"|"admin"|"user"};
type Template={id:string;title:string};
type Item={
  id:string;
  template_id:string;
  type:"text"|"yes_no"|"number"|"select"|"multi_select"|"date"|"photo"|"signature";
  title:string;
  required:boolean;
  help:string|null;
  options:any|null;
  image_url:string|null;
};

export default function TemplateBuilder(){
  const params = useParams() as { id: string };
  const tid = params.id;

  const [p,setP]=useState<Profile|null>(null);
  const [tmpl,setTmpl]=useState<Template|null>(null);
  const [items,setItems]=useState<Item[]>([]);

  // new item form
  const [title,setTitle]=useState("");
  const [type,setType]=useState<Item["type"]>("text");
  const [required,setRequired]=useState(false);
  const [help,setHelp]=useState("");
  const [options,setOptions]=useState(""); // comma-separated for select types

  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(prof as any);
    await load();
  })();},[]);

  async function load(){
    const { data: t } = await supabase.from("templates").select("*").eq("id", tid).single();
    setTmpl(t as any);
    const { data: its } = await supabase.from("template_items").select("*").eq("template_id", tid).order("title");
    setItems(its||[]);
  }

  async function add(){
    if(!title.trim()) return;
    const opts = (type==="select"||type==="multi_select") ? { choices: options.split(",").map(s=>s.trim()).filter(Boolean) } : null;
    const { data, error } = await supabase.from("template_items").insert({
      template_id: tid, type, title, required, help: help||null, options: opts
    }).select("*").single();
    if(error){ alert(error.message); return; }
    if(data){ setItems(r=>[...r, data as any]); }
    setTitle(""); setType("text"); setRequired(false); setHelp(""); setOptions("");
  }

  async function del(id:string){
    const { error } = await supabase.from("template_items").delete().eq("id", id);
    if(error){ alert(error.message); return; }
    setItems(r=>r.filter(i=>i.id!==id));
  }

  if(!p || !tmpl) return <div className="p-8">Loading...</div>;
  const isAdmin = p.role==="full_admin" || p.role==="admin";

  return (
    <div>
      <Topbar email={p.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p.role}/>
        <main className="flex-1 space-y-5">
          <h1 className="text-2xl font-bold">Template: {tmpl.title}</h1>

          {!isAdmin && <div className="text-sm text-orange-600">You can view items but not edit (admin only).</div>}

          {isAdmin && (
            <div className="card p-4 space-y-3">
              <div className="font-semibold">Add item</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Label</label>
                  <input className="input w-full" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Fire exit clear?"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select className="input w-full" value={type} onChange={e=>setType(e.target.value as any)}>
                    <option value="text">Text</option>
                    <option value="yes_no">Yes/No</option>
                    <option value="number">Number</option>
                    <option value="select">Select (single)</option>
                    <option value="multi_select">Select (multi)</option>
                    <option value="date">Date</option>
                    <option value="photo">Photo</option>
                    <option value="signature">Signature</option>
                  </select>
                </div>
                {(type==="select"||type==="multi_select") && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1">Options (comma separated)</label>
                    <input className="input w-full" value={options} onChange={e=>setOptions(e.target.value)} placeholder="Yes,No,N/A"/>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">Help text (optional)</label>
                  <input className="input w-full" value={help} onChange={e=>setHelp(e.target.value)} placeholder="What to look for…"/>
                </div>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={required} onChange={e=>setRequired(e.target.checked)}/>
                  <span>Required</span>
                </label>
              </div>
              <button className="btn" onClick={add}>Add item</button>
            </div>
          )}

          <div className="card p-4">
            <div className="font-semibold mb-2">Items</div>
            {items.length===0 && <div className="text-sm text-gray-500">No items yet.</div>}
            <ul className="space-y-2">
              {items.map(i=>(
                <li key={i.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{i.title} {i.required && <span className="text-xs text-red-600">(required)</span>}</div>
                    <div className="text-xs text-gray-500">{i.type}{i.help?` · ${i.help}`:""}</div>
                    {i.options?.choices && <div className="text-xs text-gray-500">Options: {i.options.choices.join(", ")}</div>}
                  </div>
                  {isAdmin && <button className="btn-secondary" onClick={()=>del(i.id)}>Delete</button>}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}