export function Navbar() {
    const routes = [
        {
            name: "Vehicle",
            url: "/vehicles"
        },
        {
            name: "Part",
            url: "/part"
        }
    ];

    return (
        <header>
            <nav class="navbar navbar-expand-lg fixed-top bg-body-tertiary">
                <div class="container-fluid">
                    <div className="row w-100 align-items-center">
                        <div className="col-auto">
                            <a class="navbar-brand" href="/"><i className="bi-gear"></i> PartRelate</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNav">
                            </div>
                        </div>
                        <div className="col"></div>
                        <div className="col-auto">
                            <ul class="navbar-nav">
                                {
                                    routes.map(route =>
                                        <li className="nav-item">
                                            <a href={route.url} class="nav-link">{route.name}</a>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
            </nav>
        </header>
    );
}