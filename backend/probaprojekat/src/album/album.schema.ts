import { Schema } from "redis-om";

export const schema = new Schema('album', {
    artist: { type: 'string' },
    title: { type: 'text' },
    year: { type: 'number' }
  })