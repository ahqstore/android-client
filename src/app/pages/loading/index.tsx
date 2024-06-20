import { motion } from "framer-motion";

export default function Loading() {
  return <motion.div className="flex flex-col items-center justify-center text-center absolute top-0 left-0 h-full w-full" initial={{ translateY: "50vh" }} animate={{ translateY: "0vh", opacity: 1 }} exit={{ translateY: "200vh", opacity: 1 }}>
    <motion.img src="/icon.png" width="100vw" className="mt-[20vh]" />

    <motion.h1 className="font-sans text-2xl mt-3">AHQ Store</motion.h1>

    <motion.span className="loading-spinner loading loading-lg mt-[20vh]" />
    <motion.span className="mt-2 font-sans">Loading...</motion.span>

    {import.meta.env.DEV && <button className="btn btn-ghost btn-sm mt-2" onClick={() => window.location.reload()}>Reload</button>}
  </motion.div>;
}