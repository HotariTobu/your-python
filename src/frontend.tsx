import { hydrate } from "preact";
import { App } from "./App";
import "./index.css";

function start() {
	const root = document.getElementById("root");
	if (root) {
		hydrate(<App />, root);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", start);
} else {
	start();
}
