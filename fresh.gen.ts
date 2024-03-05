// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $login_index from "./routes/login/index.tsx";
import * as $part_create_index from "./routes/part/create/index.tsx";
import * as $part_index from "./routes/part/index.tsx";
import * as $vehicle_id_index from "./routes/vehicle/[id]/index.tsx";
import * as $vehicle_create_index from "./routes/vehicle/create/index.tsx";
import * as $vehicle_index from "./routes/vehicle/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $PartCreate from "./islands/PartCreate.tsx";
import * as $PartSearch from "./islands/PartSearch.tsx";
import * as $VehicleCreate from "./islands/VehicleCreate.tsx";
import * as $VehiclePartSearch from "./islands/VehiclePartSearch.tsx";
import * as $VehicleSearch from "./islands/VehicleSearch.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/login/index.tsx": $login_index,
    "./routes/part/create/index.tsx": $part_create_index,
    "./routes/part/index.tsx": $part_index,
    "./routes/vehicle/[id]/index.tsx": $vehicle_id_index,
    "./routes/vehicle/create/index.tsx": $vehicle_create_index,
    "./routes/vehicle/index.tsx": $vehicle_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/PartCreate.tsx": $PartCreate,
    "./islands/PartSearch.tsx": $PartSearch,
    "./islands/VehicleCreate.tsx": $VehicleCreate,
    "./islands/VehiclePartSearch.tsx": $VehiclePartSearch,
    "./islands/VehicleSearch.tsx": $VehicleSearch,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
