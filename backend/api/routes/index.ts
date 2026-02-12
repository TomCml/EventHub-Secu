import express from "express";
import eventRoutes from "./EventRoutes";
import userRoutes from "./UserRoutes";
import otpRoutes from "./OtpRoutes";
import swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';
const router = express.Router();

router.use("/events", eventRoutes);
router.use("/users", userRoutes);
router.use("/otp", otpRoutes);
router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
