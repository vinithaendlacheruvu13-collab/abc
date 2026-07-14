import express from "express";
import { createApplication, getApplications } from "../controllers/applicationController.js";

const router = express.Router();

router.get("/", getApplications);
router.post("/", createApplication);

export default router;
