import { useSignal } from "@preact/signals";

export default function PartPage() {
  const count = useSignal(3);
  return (
    <div className="container">
      <h1 class="mt-5">Part</h1>
    </div>
  );
}
