import { MdHome, MdLibraryBooks, MdSettings } from "react-icons/md";

interface Props {
  setPage: (_: string) => void;
}

export default function BottomNavBar({ setPage }: Props) {
  return (
    <md-tabs>
      <md-primary-tab onClick={() => { setPage("home") }}>
        <MdHome size="1em" />
        Home
      </md-primary-tab>
      <md-primary-tab onClick={() => { setPage("library") }}>
        <MdLibraryBooks size="1em" />
        Library
      </md-primary-tab>
      <md-primary-tab onClick={() => { setPage("settings") }}>
        <MdSettings size="1em" />
        Settings
      </md-primary-tab>
    </md-tabs>
  );
}