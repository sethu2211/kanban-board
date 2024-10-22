import axios from 'axios';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

export const fetchTickets = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('API Response:', response.data); // Log response data
        return response.data.tickets; // Access the tickets property
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }
};
