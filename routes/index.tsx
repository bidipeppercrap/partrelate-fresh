export default function Home() {
  const todo = [
    "refresh vehicle detail after creating (part to vehicle part)",
    "info, edit, delete (part to vehicle part)",
    "edit, delete (vehicle part)",
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
