import { useSignal } from "@preact/signals";

export default function PartPage() {
  const count = useSignal(3);
  return (
    <div className="container my-5">
      <h1>Part</h1>
    </div>
  );
}
