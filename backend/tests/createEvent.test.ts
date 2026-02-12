import { CreateEventUseCase } from '../application/usecases/index';
import { InMemoryEventRepository } from '../infrastructure/repositories/InMemoryEventRepository';

describe('CreateEventUseCase', () => {
    let useCase: CreateEventUseCase;
    let repository: InMemoryEventRepository;

    beforeEach(() => {
        repository = new InMemoryEventRepository();
        useCase = new CreateEventUseCase(repository);
    });

    it('should throw an error if title is empty', async () => {
        const eventData = {
            title: '',
            startDate: new Date(Date.now() + 86400000), // Tomorrow
            venueId: 'venue-1',
            capacity: 100,
            price: 50,
            organizerId: 'user-1',
            categoryId: 'cat-1',
        };

        await expect(useCase.execute(eventData)).rejects.toThrow('Title is required');
    });

    it('should throw an error if start date is in the past', async () => {
        const eventData = {
            title: 'My Event',
            startDate: new Date(Date.now() - 86400000), // Yesterday
            venueId: 'venue-1',
            capacity: 100,
            price: 50,
            organizerId: 'user-1',
            categoryId: 'cat-1',
        };

        await expect(useCase.execute(eventData)).rejects.toThrow('Start date must be in the future');
    });

    it('should throw an error if venueId is missing', async () => {
        const eventData = {
            title: 'My Event',
            startDate: new Date(Date.now() + 86400000), // Tomorrow
            venueId: '',
            capacity: 100,
            price: 50,
            organizerId: 'user-1',
            categoryId: 'cat-1',
        };

        await expect(useCase.execute(eventData)).rejects.toThrow('Venue ID is required');
    });

    it('should throw an error if capacity is not positive', async () => {
        const eventData = {
            title: 'My Event',
            startDate: new Date(Date.now() + 86400000), // Tomorrow
            venueId: 'venue-1',
            capacity: -1,
            price: 50,
            organizerId: 'user-1',
            categoryId: 'cat-1',
        };

        await expect(useCase.execute(eventData)).rejects.toThrow('Capacity must be positive');
    });

    it('should throw an error if price is negative', async () => {
        const eventData = {
            title: 'My Event',
            startDate: new Date(Date.now() + 86400000), // Tomorrow
            venueId: 'venue-1',
            capacity: 100,
            price: -1,
            organizerId: 'user-1',
            categoryId: 'cat-1',
        };

        await expect(useCase.execute(eventData)).rejects.toThrow('Price must be non-negative');
    });

    it('should create an event successfully when data is valid', async () => {
        const validEventData = {
            title: 'Super Concert',
            startDate: new Date(Date.now() + 86400000), // Demain
            venueId: 'venue-1',
            capacity: 500,
            price: 45,
            organizerId: 'organizer-1',
            categoryId: 'category-A',
            description: 'A great show'
        };

        const result = await useCase.execute(validEventData);

        expect(result.props.title).toBe(validEventData.title);
        expect(result.props.id).toBeDefined();
        expect(result.props.createdAt).toBeInstanceOf(Date);


    });
});
