// recording.schema.ts

import * as mongoose from 'mongoose';

export const RecordingSchema = new mongoose.Schema({
  RecordingUrl: String,
  From: String,
  To: String,
  RecordingDuration: String,
});

export interface Recording extends mongoose.Document {
  RecordingUrl: string;
  From: string;
  To: string;
  RecordingDuration: string;
}

export const RecordingModel = mongoose.model<Recording>('Recording', RecordingSchema);
