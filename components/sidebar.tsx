import Link from "next/link";

export default function Sidebar({role}:{role:"full_admin"|"admin"|"user"}){
  const Item = ({href,label}:{href:string;label:string})=>(
    <Link href={href} className="block px-3 py-2 rounded-xl hover:bg-gray-50">{label}</Link>
  );
  return (
    <aside className="w-56 shrink-0">
      <div className="card p-3 space-y-1">
        <Item href="/dashboard" label="Dashboard"/>
        <Item href="/sites" label="Sites"/>
        <Item href="/templates" label="Templates"/>
        <Item href="/inspections" label="Inspections"/>
        <Item href="/reports" label="Reports"/>
        {(role==="full_admin"||role==="admin") && <Item href="/users" label="Users"/>}
      </div>
    </aside>
  );
}
