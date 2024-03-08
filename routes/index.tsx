export default function Home() {
  const todo = [
    "useComputed not reactive (vehiclePartList)",
    "constraint - cannot delete vehicle part when there is a part assigned"
  ];
  return (
    <div className="container my-5">
      <h1><i className="bi-gear"></i> PartRelate</h1>
      <div className="mt-3">
        <ul className="list-group">
          {todo.map(item =>
            <li className="list-group-item">{item}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
