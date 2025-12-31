import type { Vehicle } from "./Vehicle.ts";
import type { Environment } from "./Environment.ts";

export interface GGIData {
  GGI: {
    vehicle?: Vehicle;
    environment: Environment;
  };
}
