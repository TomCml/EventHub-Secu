import { EventRepositoryInterface } from "../../../domain/interfaces/EventRepositoryInterface";

export class DeleteEventUseCase {
    constructor(private readonly eventRepository: EventRepositoryInterface) { }

    async execute(eventId: string): Promise<void> {
        if (!eventId) {
            throw new Error('Event ID is required');
        }

        const existingEvent = await this.eventRepository.findById(eventId);
        if (!existingEvent) {
            throw new Error('Event not found');
        }

        await this.eventRepository.delete(eventId);
    }
}