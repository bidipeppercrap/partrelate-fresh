import { Part } from "./part.ts";

export interface PartToVehiclePart {
    id?: number,
    vehiclePartId: number,
    partId: number,
    description: string,
    quantity: string,
    parts?: Part
}