// Imports

import axios from 'axios';
import dotenv from 'dotenv';
import { DefaultReturnObject } from '../../types';

// Load environment variables

dotenv.config();

// Environment variables

const shellyCloudUrl = process.env.SHELLY_CLOUD_URL;
const shellyAuthToken = process.env.SHELLY_AUTH_TOKEN;
const shellyDeviceId = process.env.SHELLY_DEVICE_ID;

if (!shellyCloudUrl || !shellyAuthToken || !shellyDeviceId) {
    throw new Error('Missing environment variables');
}

// Exports

export async function turnOn(on: boolean): Promise<DefaultReturnObject<boolean>> {
    try{

        const response = await axios.post<{ id: number, method: string, params: { id: number, on: boolean }, target: { type: string, id: string } }>(
            `${shellyCloudUrl}/device/rpc`,
            {
                id: Date.now(),
                method: 'Switch.Set',
                params: {
                    id: 0,
                    on,
                },
                target: {
                    type: 'device',
                    id: shellyDeviceId,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${shellyAuthToken}`,
                },
                timeout: 10_000,
            }
        );

        if (response.status !== 200) {
            return {
                status: false,
                data: false,
                message: 'Shelly Cloud returned non-200 status',
            };
        }

        return {
            status: true,
            message: 'Shelly plug updated successfully',
            data: true,
        };

    } catch (error) {
        return {
            status: false,
            data: false,
            message: (error as Error).message
        }
    }
}

