"use client";
import Topbar from "@/components/topbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile={id:string;email:string;role:"full_admin"|"admin"|"user"};

export default function Users(){
  const [p,setP]=useState<Profile|null>(null);
  const [rows,setRows]=useState<Profile[]>([]);

  useEffect(()=>{(async()=>{
    const { data: { session } } = await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    const { data: me } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    setP(me as any);
    const { data } = await supabase.from("profiles").select("*");
    setRows(data||[]);
  })();},[]);

  if(!p) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <Topbar email={p.email}/>
      <div className="container-max py-6 flex gap-6">
        <Sidebar role={p.role}/>
        <main className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">Users</h1>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50"><tr><th className="p-2 text-left">Email</th><th className="p-2">Role</th></tr></thead>
            <tbody>
              {rows.map(u=>(<tr key={u.id} className="border-t"><td className="p-2">{u.email}</td><td className="p-2">{u.role}</td></tr>))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
