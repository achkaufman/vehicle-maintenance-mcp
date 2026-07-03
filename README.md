# vehicle-maintenance-mcp

A minimal local MCP server for tracking vehicle data.

Current scope is intentionally small for learning purposes:
- Local SQLite database in [data/maintenance.db](data/maintenance.db)
- One MCP tool: add_vehicle
- Stdio transport for MCP clients (for example, VS Code MCP or Claude Desktop)

## Overview

This project provides a local MCP server that can insert vehicles into a SQLite database.
On server startup, the schema is created automatically if it does not exist.

Key files:
- MCP server: [src/mcp/server.js](src/mcp/server.js)
- Database setup and insert logic: [src/db/index.js](src/db/index.js)
- SQL schema: [src/db/schema.sql](src/db/schema.sql)

## Tools

### add_vehicle

Adds one vehicle to the local database.

Input fields:
- name: string (required)
- make: string (required)
- model: string (required)
- year: integer (required)
- vin: string (optional)

Output:
- JSON text payload with ok status and the inserted vehicle object (including generated id)

## Run Locally

From repo root:

1. Install dependencies:

```bash
npm install
```

2. Start the MCP server:

```bash
npm start
```

The server runs over stdio and waits for MCP client requests.

## Configure In an MCP Client

Example configuration (adjust path to your repo):

```json
{
	"mcpServers": {
		"vehicle-maintenance": {
			"command": "npm",
			"args": ["start"],
			"cwd": "C:/Users/achka/repos/vehicle-maintenance-mcp"
		}
	}
}
```

## Use This With an Agent

### Prompt examples

- "Add my vehicle to the maintenance database: 2021 Honda CR-V, call it Family SUV, VIN 1HGBH41JXMN109186."
- "Please save a new vehicle named Work Truck. It is a 2018 Ford F-150."
- "I bought a 2023 Tesla Model Y. Add it to my vehicle maintenance records with the name Daily Driver."

### What the agent should do

1. Recognize that your request is creating a vehicle record.
2. Choose the add_vehicle tool.
3. Ask follow-up questions only if required fields are missing.
4. Call the tool and confirm success.

### Required details the agent must collect

- name
- make
- model
- year

VIN is optional. If you do not provide it, the tool can still create the vehicle.
