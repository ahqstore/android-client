import { BiSearch } from "react-icons/bi";

import "./home.css";
import { useState } from "react";

export default function HomePage() {
  const [a, ss] = useState("");

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
        ss("HHH");
      }}>
        <md-outlined-text-field autocomplete="off" placeholder="Search for apps">
          {/* @ts-ignore */}
          <BiSearch size="1.4em" slot="leading-icon" />
        </md-outlined-text-field>
      </form>
      <h1>{a}</h1>
    </>
  )
}