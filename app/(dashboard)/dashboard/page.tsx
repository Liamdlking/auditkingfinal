"use client";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile = { id: string; email: string; role: "full_admin"|"admin"|"user" };

export default function Dashboard() {
  const [p,setP] = useState<Profile|null>(null);
  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href="/login"; return; }
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(prof as any);
  })();},[]);

  if(!p) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <Topbar email={p.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p.role}/>
        <main className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-4"><div className="text-sm text-gray-500 font-semibold">Sites</div><div className="text-2xl font-bold">Manage locations</div></div>
            <div className="card p-4"><div className="text-sm text-gray-500 font-semibold">Templates</div><div className="text-2xl font-bold">Build checksheets</div></div>
            <div className="card p-4"><div className="text-sm text-gray-500 font-semibold">Inspections</div><div className="text-2xl font-bold">Run & export</div></div>
          </div>
        </main>
      </div>
    </div>
  );
}
