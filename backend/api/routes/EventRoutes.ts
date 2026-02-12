import { Router } from "express";
import { AuthMiddleware } from "../middlewares";
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from "../controllers/EventControllers";

const router = Router();

router.get("/",getAllEvents);

router.get("/:id", AuthMiddleware, getEventById);

router.post("/", AuthMiddleware, createEvent);

router.put("/:id", AuthMiddleware, updateEvent);

router.delete("/:id", AuthMiddleware, deleteEvent);

export default router;
