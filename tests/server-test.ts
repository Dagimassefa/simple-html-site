import request from 'supertest';
import express from 'express';
import { getComments } from '../node/index';
import { jest } from '@jest/globals';

interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

jest.mock('../node/index', () => ({
    getComments: jest.fn<() => Promise<Comment[]>>() as jest.MockedFunction<typeof getComments>,
}));

describe('Server-side search functionality', () => {
    const app = express();
    app.get('/comments', async (req, res) => {
        const comments = await getComments();
        res.json(comments);
    });

    it('Should return comments', async () => {
        const mockComments: Comment[] = [
            { postId: 1, id: 1, name: 'Test Comment', email: 'test@example.com', body: 'This is a test' },
        ];

        (getComments as jest.MockedFunction<typeof getComments>).mockResolvedValue(mockComments);

        const res = await request(app).get('/comments');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockComments);
    });
});
