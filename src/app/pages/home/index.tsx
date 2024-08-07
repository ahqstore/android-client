import { BiArrowBack } from "react-icons/bi";
import { BsArrowRight, BsSearch } from "react-icons/bs";
import { Fragment, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import "./home.css";
import Grid from "./grid";

interface Props {
  home: [string, string[]][]
}

export default function HomePage({ home }: Props) {
  const [rawSearch, ss] = useState("");

  const [a, setS] = useState("");

  return (
    <div className="overflow-hidden flex flex-col">
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
            {a == rawSearch && a != "" && <motion.button transition={{ duration: 0.125 }} type="reset" initial={{ translateX: "-15vw" }} animate={{ translateX: "0vw" }} exit={{ translateX: "-15vw", }}> <BiArrowBack /> </motion.button>}
          </AnimatePresence>
          <motion.input type="search" className="grow" placeholder="Search for applications" value={rawSearch} onChange={(e) => ss(e.target.value)} />
          <motion.button><BsSearch /></motion.button>
        </motion.label>
      </motion.form>
      <h1>{a}</h1>
      <div className="flex flex-col w-full mt-3 overflow-y-scroll">
        {a == "" && home.map(([title, apps], i) => <Fragment key={i}>
          <div className="flex flex-row text-center items-center">
            {title}
            <button className="btn bg-base-300 btn-sm border-[1px] border-base-content btn-circle ml-auto">
              <BsArrowRight size={"1em"} />
            </button>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] w-[100%]">
            {apps.map((app, ind) => ind < 2 ? <Grid id={app} key={`app${ind}`} /> : <></>)}
          </div>
        </Fragment>)}
      </div>
    </div>
  )
}