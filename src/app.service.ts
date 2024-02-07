import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recording } from './model/recordings.model';
import { CallRecord } from './model/call.model';
import { Response } from 'express';
import { Twilio } from 'twilio';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    @InjectModel('Recording') private readonly recordingModel: Model<Recording>,
    @InjectModel('CallRecord') private readonly callRecordModel: Model<CallRecord>
  ) {}
  client = new Twilio(
    this.configService.get('sid'),
    this.configService.get('token'),
  );

  menu() {
    const twiml = new VoiceResponse();
    twiml.say(
      'Press 1 to talk to the representative. Press 2 to leave a message.',
    );
    return twiml.toString();
  }

  async createCallRecord(callSid: string, recordingUrl: string, to: string, from: string): Promise<CallRecord> {
    const newCallRecord = new this.callRecordModel({
      callSid,
      recordingUrl,
      to,
      from,
    });
    return await newCallRecord.save();
  }

  //inbound call and Voice mail

  async inBoundCall(id: string, res: Response) {
    const twiml = new VoiceResponse();
    console.log(id);
    if (id) {
      switch (id) {
        case '1':

          twiml.say('You call is being redirected. Please wait!');
          const call = await this.client.calls.create({
            twiml: `<Response><Say>Hello this is a test call</Say></Response>`,
            to: this.configService.get('forwadingNumber'),
            from: this.configService.get('twillioNumber'),
          });
                      
          const newCallRecord = new this.callRecordModel({
            callSid: call.sid,
            to: call.to,
            from: call.from,
          });
          await newCallRecord.save();

          break;
        case '2':
          await this.client.calls.create({
            twiml: `<Response>
            <Say>Please leave a message after the tone.</Say>
            <Record action="/record" method="POST" maxLength="60" finishOnKey= "#"
            recordingStatusCallback= "/recording-status"
            recordingStatusCallbackMethod= "POST" />
            </Response>`,
            to: this.configService.get('forwadingNumber'),
            from: this.configService.get('twillioNumber'),
          });

          break;
        default:
          twiml.say('This is not a valid option.');
          twiml.pause();
          break;
      }
    }
    res.type('text/xml');
    res.send(twiml.toString());
  }

  //Recording Voice Mail

  async recordingVoiceMail(data: any): Promise<Recording> {
    const { RecordingUrl, From, To, RecordingDuration } = data;

    const newRecording = new this.recordingModel({
      RecordingUrl,
      From,
      To,
      RecordingDuration,
    });

    return await newRecording.save();
  }

  recordingStatus = (res: Response, data: any) => {
    const recordingStatus = data.RecordingStatus;
    const recordingUrl = data.RecordingUrl;
    res.send({ recordingUrl, recordingStatus });
  };

  //get all recordings from the database
  async getRecordings(): Promise<Recording[]> {
    return await this.recordingModel.find().exec();
  }

  //get all call records from the database
  async getCallRecords(): Promise<CallRecord[]> {
    return await this.callRecordModel.find().exec();
  }
}
