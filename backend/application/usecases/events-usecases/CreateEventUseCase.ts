import { EventRepositoryInterface } from "../../../domain/interfaces/EventRepositoryInterface";
import { EventProps, Event } from "../../../domain/entities/Event";
import { randomUUID } from "crypto";

export interface CreateEventInput {
    title: string;
    description?: string;
    startDate: Date;
    venueId: string;
    capacity: number;
    price?: number;
    organizerId: string;
    categoryId: string;
    imageUrl?: string;
}

export class CreateEventUseCase {
    constructor(private readonly eventRepository: EventRepositoryInterface) { }

    async execute(eventData: CreateEventInput): Promise<Event> {
        if (!eventData.title) {
            throw new Error('Title is required');
        }
        if (eventData.startDate < new Date()) {
            throw new Error('Start date must be in the future');
        }
        if (!eventData.venueId) {
            throw new Error('Venue ID is required');
        }
        if (eventData.capacity <= 0) {
            throw new Error('Capacity must be positive');
        }
        if (eventData.price !== undefined && eventData.price < 0) {
            throw new Error('Price must be non-negative');
        }

        const eventProps: EventProps = {
            ...eventData,
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const event = new Event(eventProps);
        return this.eventRepository.create(event);
    }
}
