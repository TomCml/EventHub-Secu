import { EventRepositoryInterface } from "../../../domain/interfaces/EventRepositoryInterface";
import { Event } from "../../../domain/entities/Event";

export class UpdateEventUseCase {
    constructor(private readonly eventRepository: EventRepositoryInterface) { }

    async execute(eventId: string, eventData: Partial<Event>): Promise<Event> {
        if (!eventId) {
            throw new Error('Event ID is required');
        }

        const existingEvent = await this.eventRepository.findById(eventId);
        if (!existingEvent) {
            throw new Error('Event not found');
        }

        return this.eventRepository.update(eventId, eventData as Event);
    }
}
