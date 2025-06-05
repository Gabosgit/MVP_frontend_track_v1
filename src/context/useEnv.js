import { useContext } from "react";
import { EnvContext } from "../context/EnvContext";

export default function useEnv() {
  return useContext(EnvContext);
}
