"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Topbar({email}:{email?:string}){
  const r = useRouter();
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container-max h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">👑</div>
          <span className="text-lg font-bold">Audit King</span>
        </div>
        <div className="flex items-center gap-4">
          {email && <span className="text-sm text-gray-600">Signed in as {email}</span>}
          <button className="btn !py-2 !px-3" onClick={async()=>{await supabase.auth.signOut(); r.push("/login");}}>
            <LogOut size={18}/> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
