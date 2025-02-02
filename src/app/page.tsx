import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTable } from "@/components/table";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="gap-4">

        <span className="display-1">Scammers Database</span>

      </header>

      <main className="flex flex-col gap-8 row-start-2 sm:items-start">
        <DataTable />

      </main>

      <footer className="row-start-3 flex gap-1 flex-wrap justify-center">
        A project by <Link href="https://twitter.com/christianaugustyn" className="text-blue-600">Christian Augustyn</Link>
      </footer>
    </div>
  );
}
