"use client";
import { useEffect, useState } from "react";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { supabase } from "@/lib/supabaseClient";

type Profile={id:string;email:string;role:"full_admin"|"admin"|"user"};
type Site={id:string;name:string};
type Template={id:string;title:string};
type Inspection={id:string;title:string|null;site_id:string|null;template_id:string|null;started_at:string;completed_at:string|null;state:string};

export default function ReportsPage(){
  const [p,setP]=useState<Profile|null>(null);
  const [sites,setSites]=useState<Site[]>([]);
  const [tmpls,setTmpls]=useState<Template[]>([]);
  const [rows,setRows]=useState<Inspection[]>([]);
  const [site,setSite]=useState("");
  const [tmpl,setTmpl]=useState("");
  const [start,setStart]=useState("");
  const [end,setEnd]=useState("");

  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(prof as any);
    const { data: s } = await supabase.from("sites").select("id,name");
    const { data: t } = await supabase.from("templates").select("id,title");
    setSites(s||[]);
    setTmpls(t||[]);
    await load();
  })();},[]);

  async function load(){
    let q = supabase.from("inspections").select("*").order("started_at",{ascending:false});
    if(site) q = q.eq("site_id",site);
    if(tmpl) q = q.eq("template_id",tmpl);
    if(start) q = q.gte("started_at",start);
    if(end) q = q.lte("started_at",end);
    const { data } = await q;
    setRows(data||[]);
  }

  if(!p) return <div className="p-8">Loading...</div>;

  const total=rows.length;
  const completed=rows.filter(r=>r.state==="completed").length;
  const avg=(()=>{
    const list=rows.filter(r=>r.completed_at).map(r=>(new Date(r.completed_at!).getTime()-new Date(r.started_at).getTime())/60000);
    return list.length?(list.reduce((a,b)=>a+b,0)/list.length).toFixed(1):"–";
  })();

  return (
    <div>
      <Topbar email={p?.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p?.role}/>
        <main className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold">Reports</h1>

          <div className="flex flex-wrap gap-3 items-end">
            <select className="input w-auto" value={site} onChange={e=>setSite(e.target.value)}>
              <option value="">All Sites</option>
              {sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select className="input w-auto" value={tmpl} onChange={e=>setTmpl(e.target.value)}>
              <option value="">All Templates</option>
              {tmpls.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}
            </select>

            <input type="date" className="input w-auto" value={start} onChange={e=>setStart(e.target.value)}/>
            <input type="date" className="input w-auto" value={end} onChange={e=>setEnd(e.target.value)}/>
            <button className="btn" onClick={load}>Apply</button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="text-sm text-gray-500 font-semibold">Total</div>
              <div className="text-2xl font-bold">{total}</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-500 font-semibold">Completed</div>
              <div className="text-2xl font-bold">{completed}</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-500 font-semibold">Avg Duration (min)</div>
              <div className="text-2xl font-bold">{avg}</div>
            </div>
          </div>

          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Started</th>
                <th className="p-2 text-left">Completed</th>
                <th className="p-2 text-left">State</th>
                <th className="p-2 text-left">Export</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.title || "Untitled"}</td>
                  <td className="p-2">{new Date(r.started_at).toLocaleString()}</td>
                  <td className="p-2">{r.completed_at ? new Date(r.completed_at).toLocaleString() : "–"}</td>
                  <td className="p-2 capitalize">{r.state}</td>
                  <td className="p-2">
                    <a className="btn-secondary" href={`/api/export/${r.id}`} target="_blank" rel="noreferrer">PDF</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </main>
      </div>
    </div>
  );
}
