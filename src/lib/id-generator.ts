import { v4 as uuidv4 } from 'uuid';

export function generateUniqueUUID(): string {
    return uuidv4();
}
