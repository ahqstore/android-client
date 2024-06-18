import { BiArrowBack } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import "./home.css";

export default function HomePage() {
  const [rawSearch, ss] = useState("");

  const [a, setS] = useState("");

  return (
    <>
      <motion.form onSubmit={(e) => {
        e.preventDefault();
        setS(rawSearch);
      }}
        onReset={(e) => {
          e.preventDefault();
          ss("");
          setS("");
        }}>
        <motion.label className="input input-bordered flex items-center gap-2">
          <AnimatePresence>
            {a == rawSearch && a != "" && <motion.button type="reset" initial={{ translateX: "-25vw" }} animate={{ translateX: "0vw" }} exit={{ translateX: "-15vw" }}> <BiArrowBack /> </motion.button>}
          </AnimatePresence>
          <motion.input type="search" className="grow" placeholder="Search for applications" value={rawSearch} onChange={(e) => ss(e.target.value)} />
          <motion.button><BsSearch /></motion.button>
        </motion.label>
      </motion.form>
      <h1>{a}</h1>
    </>
  )
}