import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;
const CACHE_DURATION = 5 * 60 * 1000;
const COMMENTS_API_URL = 'https://jsonplaceholder.typicode.com/comments?postId=3';

app.use(cors());

interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

interface Cache {
    data?: Comment[];
    timestamp?: number;
}

const cache: Cache = {};

const fetchComments = async (): Promise<Comment[]> => {
    try {
        const response = await fetch(COMMENTS_API_URL); 
        if (!response.ok) {
            throw new Error(`fetch failed: ${response.statusText}`);
        }
        const data: Comment[] = await response.json();
        cache.data = data;
        cache.timestamp = Date.now();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch comments');
    }
};


export const getComments = async (): Promise<Comment[]> => {
    if (cache.data && cache.timestamp && Date.now() - cache.timestamp < CACHE_DURATION) {
        return cache.data;
    }
    return await fetchComments();
};


app.get('/comments', async (req: Request, res: Response) => {
    const query = (req.query.q as string || '').toLowerCase();
    try {
        const comments = await getComments();
        const filteredComments = comments.filter(comment => comment.name.toLowerCase().includes(query));
        res.json(filteredComments);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
