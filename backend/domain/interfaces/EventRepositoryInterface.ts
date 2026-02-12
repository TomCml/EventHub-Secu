import { Event } from '../entities/Event';

export interface EventRepositoryInterface {
    create(event: Event): Promise<Event>;

    findAll(): Promise<Event[]>;

    findById(id: string): Promise<Event | null>;

    delete(id: string): Promise<void>;

    update(id: string, event: Event): Promise<Event>;
}
