import { PartToVehiclePart } from "./part-to-vehicle-part.ts";

export interface VehiclePart {
    id?: number,
    vehicleId: number,
    name: string,
    description: string,
    note: string,
    partsToVehicleParts: PartToVehiclePart[]
}