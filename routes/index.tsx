import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <div className="container">
      <h1><i className="bi-gear"></i> PartRelate</h1>
    </div>
  );
}
