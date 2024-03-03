import { type PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { Navbar } from "../components/Navbar.tsx";
import { Footer } from "../components/SimpleFooter.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html class="h-100">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PartRelate</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/bootstrap.min.css" />
        <link rel="stylesheet" href="/bootstrap-icons.min.css" />
      </head>
      <body class="d-flex flex-column h-100">
        <Navbar />
        <main className="flex-shrink-0" f-client-nav>
          <Partial name="routes">
            <Component />
          </Partial>
        </main>
        <Footer />
      </body>
    </html>
  );
}
