import { VehiclePart } from "./vehicle-part.ts";
import { Vehicle } from "./vehicle.ts";

export interface VehicleDetail extends Vehicle {
    vehicleParts: VehiclePart[]
}

export const vehicleDetailRaw: VehicleDetail = {
    name: "",
    description: "",
    note: "",
    vehicleParts: []
}