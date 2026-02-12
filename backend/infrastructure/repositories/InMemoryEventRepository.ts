import { EventRepositoryInterface } from '../../domain/interfaces/EventRepositoryInterface';
import { Event } from '../../domain/entities/Event';

export class InMemoryEventRepository implements EventRepositoryInterface {
    public events: Event[] = [];

    async create(event: Event): Promise<Event> {
        this.events.push(event);
        return event;
    }

    async findAll(): Promise<Event[]> {
        return this.events;
    }

    async findById(id: string): Promise<Event | null> {
        return this.events.find((e) => e.id === id) || null;
    }

    async delete(id: string): Promise<void> {
        this.events = this.events.filter((e) => e.id !== id);
    }

    async update(id: string, event: Event): Promise<Event> {
        const index = this.events.findIndex((e) => e.id === id);
        if (index === -1) {
            throw new Error('Event not found');
        }
        this.events[index] = event;
        return event;
    }
}
