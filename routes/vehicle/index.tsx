import { useSignal } from "@preact/signals";

export default function VehiclePage() {
  const count = useSignal(3);
  return (
    <div className="container">
      <h1>Vehicle</h1>
    </div>
  );
}
