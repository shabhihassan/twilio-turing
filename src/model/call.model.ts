import * as mongoose from 'mongoose';

export const CallRecordSchema = new mongoose.Schema({
  callSid: String,
  recordingUrl: String,
  to: String,
  from: String,
});

export interface CallRecord extends mongoose.Document {
  callSid: string;
  recordingUrl: string;
  to: string;
  from: string;
}

export const CallRecordModel = mongoose.model<CallRecord>('CallRecord', CallRecordSchema);
