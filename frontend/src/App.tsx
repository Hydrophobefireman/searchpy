import "@kit/styles";

// javascript is supported
import "./App.css";

import { VNode, render } from "@hydrophobefireman/ui-lib";
import { AlertRoot } from "@kit/alerts";
import {
  installLocalStorageReflection,
  installPreferenceReflection,
} from "@kit/theme";

import { RouteLoader } from "./components/RouteLoader";

installLocalStorageReflection();
installPreferenceReflection();

function App(): VNode {
  return (
    <AlertRoot>
      <main>
        <RouteLoader />
      </main>
    </AlertRoot>
  );
}

render(<App />, document.getElementById("app-mount"));
