import { MdLibraryBooks, MdSettings } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { RiAppsFill } from "react-icons/ri";

interface Props {
  setPage: (_: string) => void;
}

export default function BottomNavBar({ setPage }: Props) {
  return (
    <div className="bg-base-300">
      <md-tabs>
        <md-primary-tab onClick={() => { setPage("home") }}>
          <RiAppsFill size="1em" />
          Apps
        </md-primary-tab>
        <md-primary-tab onClick={() => { setPage("library") }}>
          <MdLibraryBooks size="1em" />
          Library
        </md-primary-tab>
        <md-primary-tab onClick={() => { setPage("settings") }}>
          <MdSettings size="1em" />
          Settings
        </md-primary-tab>
        {import.meta.env.DEV && <md-primary-tab onClick={() => { window.location.reload() }}>
          <IoMdRefresh size="1em" />
          Reload
        </md-primary-tab>}
      </md-tabs>
    </div>
  );
}