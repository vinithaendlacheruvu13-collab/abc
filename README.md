# Campus Job Board MERN Prototype

A MERN-style conversion of the Campus Job Board UI prototype.

## Run locally

1. Install Node.js, or use the local portable Node runtime in `.tools`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React client and Express server:
   ```bash
   npm run dev
   ```
4. Open:
   ```text
   http://localhost:5173/
   ```

The React client calls the Express API at:

```text
http://localhost:5000/api
```

## Notes

- The app uses React for the UI and Express for mock API endpoints.
- MongoDB/Mongoose wiring is included under `server/config` and `server/models`.
- A live MongoDB database is optional for this prototype. If `MONGO_URI` is not set, the server uses realistic in-memory dummy data.

## If npm is not recognized

This workspace includes helper scripts for the local portable Node runtime:

```cmd
scripts\npm-local.cmd install
scripts\dev.cmd
```

PowerShell alternatives are also included:

```powershell
.\scripts\npm-local.ps1 install
.\scripts\dev.ps1
```

Use `scripts\dev.cmd` to run the MERN prototype at the usual Vite URL:

```text
http://localhost:5173/
```
