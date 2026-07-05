import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const dataDir = path.join(repoRoot, "data");
const dbPath = path.join(dataDir, "maintenance.db");
const schemaPath = path.join(__dirname, "schema.sql");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
const schemaSql = fs.readFileSync(schemaPath, "utf8");
db.exec(schemaSql);

const insertVehicleStatement = db.prepare(
  `INSERT INTO vehicles (id, name, make, model, year, vin)
   VALUES (@id, @name, @make, @model, @year, @vin)`
);

const listVehiclesStatement = db.prepare(
  `SELECT id, name, make, model, year, vin
   FROM vehicles
   ORDER BY year DESC, make ASC, model ASC, name ASC`
);

export function addVehicle({ name, make, model, year, vin }) {
  const vehicle = {
    id: crypto.randomUUID(),
    name,
    make,
    model,
    year,
    vin: vin ?? null
  };

  insertVehicleStatement.run(vehicle);
  return vehicle;
}

export function listVehicles() {
  return listVehiclesStatement.all();
}
