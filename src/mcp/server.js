import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { addVehicle, listVehicles } from "../db/index.js";

const server = new McpServer({
  name: "vehicle-maintenance-mcp",
  version: "0.1.0"
});

server.tool(
  "add_vehicle",
  `
  Adds a vehicle that the user owns or manages to their vehicle inventory.

  Use this when:
  - the user mentions a new vehicle they want to track
  - setting up vehicle maintenance history

  Do not use this when:
  - recording repairs or maintenance
  - updating mileage
  - changing information for an existing vehicle
  `,
  {
    name: z.string().min(1).describe("A user-friendly vehicle name, such as 'Family SUV'."),
    make: z.string().min(1).describe("Manufacturer name, such as 'Toyota' or 'Honda'."),
    model: z.string().min(1).describe("Model name, such as 'Camry' or 'CR-V'."),
    year: z.number().int().min(1886).max(3000).describe("Model year as a 4-digit integer."),
    vin: z.string().min(1).optional().describe("Optional vehicle identification number."),
  },
  async (args) => {
    const vehicle = addVehicle(args);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok: true, vehicle }, null, 2)
        }
      ]
    };
  }
);

server.tool(
  "list_vehicles",
  `
  Returns all vehicles currently stored in the local vehicle inventory database.

  Use this when:
  - the user asks to view their vehicles
  - the user asks what vehicles are already tracked
  - you need vehicle IDs before another tool call

  Do not use this when:
  - adding a new vehicle
  - updating existing vehicle details
  `,
  async () => {
    const vehicles = listVehicles();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok: true, count: vehicles.length, vehicles }, null, 2)
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
