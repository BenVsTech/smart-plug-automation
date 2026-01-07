// Imports

import { switchLazySpa } from '../service/shell.service';
import { timesToSwitch } from '../../constants';
import { getTimeFromDate } from '../cores/date';
import { turnOn } from '../cores/shelly';

// Mock the dependencies

jest.mock('../cores/date');
jest.mock('../cores/shelly');
const mockGetTimeFromDate = getTimeFromDate as jest.MockedFunction<typeof getTimeFromDate>;
const mockTurnOn = turnOn as jest.MockedFunction<typeof turnOn>;

// Mock environment variable

const TEST_DEVICE_ID = 'test-device-id-123';

// Tests

describe('switchLazySpa', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = {
            ...originalEnv,
            SHELLY_LAZY_SPA_DEVICE_ID: TEST_DEVICE_ID
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should turn on the lazy spa when time matches on time', async () => {
        const testDate = new Date('2024-01-01T10:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: true,
            data: timesToSwitch.lazySpa.on,
            message: 'Time retrieved successfully'
        });
        mockTurnOn.mockResolvedValue({
            status: true,
            data: true,
            message: 'Shelly plug updated successfully'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(true);
        expect(result.data).toBe(true);
        expect(mockGetTimeFromDate).toHaveBeenCalledWith(testDate);
        expect(mockTurnOn).toHaveBeenCalledWith(true, TEST_DEVICE_ID);
        expect(result.message).toContain('turned on');
    });

    it('should turn off the lazy spa when time matches off time', async () => {
        const testDate = new Date('2024-01-01T22:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: true,
            data: timesToSwitch.lazySpa.off,
            message: 'Time retrieved successfully'
        });
        mockTurnOn.mockResolvedValue({
            status: true,
            data: true,
            message: 'Shelly plug updated successfully'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(true);
        expect(result.data).toBe(true);
        expect(mockGetTimeFromDate).toHaveBeenCalledWith(testDate);
        expect(mockTurnOn).toHaveBeenCalledWith(false, TEST_DEVICE_ID);
        expect(result.message).toContain('turned off');
    });

    it('should return error when getTimeFromDate fails', async () => {
        const testDate = new Date('2024-01-01T10:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: false,
            data: '',
            message: 'Failed to get time'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toBe('Failed to get time');
        expect(mockTurnOn).not.toHaveBeenCalled();
    });

    it('should return error when getTimeFromDate returns no data', async () => {
        const testDate = new Date('2024-01-01T10:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: true,
            data: '',
            message: 'Time retrieved successfully'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toBe('Time retrieved successfully');
        expect(mockTurnOn).not.toHaveBeenCalled();
    });

    it('should return error when turnOn fails for on operation', async () => {
        const testDate = new Date('2024-01-01T10:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: true,
            data: timesToSwitch.lazySpa.on,
            message: 'Time retrieved successfully'
        });
        mockTurnOn.mockResolvedValue({
            status: false,
            data: false,
            message: 'Failed to turn on device'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toBe('Failed to turn on device');
        expect(mockTurnOn).toHaveBeenCalledWith(true, TEST_DEVICE_ID);
    });

    it('should return error when turnOn fails for off operation', async () => {
        const testDate = new Date('2024-01-01T22:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: true,
            data: timesToSwitch.lazySpa.off,
            message: 'Time retrieved successfully'
        });
        mockTurnOn.mockResolvedValue({
            status: false,
            data: false,
            message: 'Failed to turn off device'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toBe('Failed to turn off device');
        expect(mockTurnOn).toHaveBeenCalledWith(false, TEST_DEVICE_ID);
    });

    it('should return error when turnOn returns no data for on operation', async () => {
        const testDate = new Date('2024-01-01T10:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: true,
            data: timesToSwitch.lazySpa.on,
            message: 'Time retrieved successfully'
        });
        mockTurnOn.mockResolvedValue({
            status: true,
            data: false,
            message: 'Shelly plug updated successfully'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toBe('Shelly plug updated successfully');
    });

    it('should return error when time does not match on or off time', async () => {
        const testDate = new Date('2024-01-01T15:00:00');
        mockGetTimeFromDate.mockResolvedValue({
            status: true,
            data: '15:00',
            message: 'Time retrieved successfully'
        });

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toContain('Invalid time: 15:00');
        expect(mockTurnOn).not.toHaveBeenCalled();
    });

    it('should handle exceptions gracefully', async () => {
        const testDate = new Date('2024-01-01T10:00:00');
        mockGetTimeFromDate.mockRejectedValue(new Error('Unexpected error'));

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toBe('Unexpected error');
    });

    it('should handle exceptions with non-Error objects', async () => {
        const testDate = new Date('2024-01-01T10:00:00');
        mockGetTimeFromDate.mockRejectedValue('String error');

        const result = await switchLazySpa(testDate);

        expect(result.status).toBe(false);
        expect(result.data).toBe(false);
        expect(result.message).toBeUndefined();
    });
});


