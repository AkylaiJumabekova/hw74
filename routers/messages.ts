import express from 'express';
import { promises as fs } from 'fs';
import type { Message } from '../types';

const messagesRouter = express.Router();
const messagesDirectory = './messages';

messagesRouter.get('/', async (req, res) => {
    try {
        const messages: Message[] = [];
        const fileNames = await fs.readdir(messagesDirectory);

        for (const fileName of fileNames.slice(-5)) {
            const fileContents = await fs.readFile(`${messagesDirectory}/${fileName}`);
            const message = JSON.parse(fileContents.toString()) as Message;
            messages.push(message);
        };

        return res.status(200).send(messages);

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to read messages' });
    }
});

messagesRouter.post('/', async (req, res) => {
    try {
        const { message: messageText } = req.body;

        if (!messageText) {
            return res.status(400).send('Wrong data');
        }

        const newMessage: Message = {
            message: messageText,
            datetime: new Date().toISOString(),
        };

        const filePath = `${messagesDirectory}/${newMessage.datetime}.txt`;

        await fs.writeFile(filePath, JSON.stringify(newMessage));
        return res.status(201).send(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to save message' });
    }
});

export default messagesRouter;