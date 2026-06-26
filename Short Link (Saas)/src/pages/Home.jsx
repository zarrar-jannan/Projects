import { Plus } from "lucide-react";
import { useState } from "react";
import CreateModal from "../components/layouts/CreateModal/CreateModal";import { AnimatePresence } from "framer-motion";
export function Home() {

  const [showCreateModal, setShowCreateModal] = useState(false)

  function handleCreateButton() {
    setShowCreateModal(true)
  }

  return (
    <div className="w-full h-[calc(100vh-40px)] bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-sm mb-6">
          🚀 Link Management Dashboard
        </div>


        <h1 className="text-5xl font-bold text-white leading-tight">
          Create, Track & Manage
          <span className="block text-zinc-400">
            Smart Links Effortlessly
          </span>
        </h1>


        <p className="text-zinc-500 text-lg mt-5 max-w-xl mx-auto">
          Shorten URLs, generate QR codes, monitor analytics,
          create expiring links and manage everything from one place.
        </p>


        <div className="mt-10 flex justify-center">
          <button
            onClick={handleCreateButton}
            className="group cursor-pointer flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-semibold text-lg transition-all duration-300 hover:scale-90 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <Plus size={22} />
            Create New Link
          </button>
        </div>

        <AnimatePresence>
          {showCreateModal && <CreateModal setShowCreateModal={setShowCreateModal} />}
        </AnimatePresence>


        <div className="grid grid-cols-3 gap-4 mt-14">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
            <p className="text-zinc-500 text-sm">Links</p>
            <h3 className="text-2xl font-bold text-white mt-2">0</h3>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
            <p className="text-zinc-500 text-sm">Pages</p>
            <h3 className="text-2xl font-bold text-white mt-2">0</h3>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
            <p className="text-zinc-500 text-sm">QR Codes</p>
            <h3 className="text-2xl font-bold text-white mt-2">0</h3>
          </div>
        </div>
      </div>
    </div>
  );
}