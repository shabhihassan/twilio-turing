import { Controller, Get, Post, Param, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { RecordingDTO, RecordingStatusDTO } from './dto/recording.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('voice')
  menu(){
    return this.appService.menu();
  }
  @Post('voice/:id')
  inBoundCall(@Param('id') id : string, @Res() res: Response){
    return this.appService.inBoundCall(id, res);
  }

  @Post('record')
  async recordingVoiceMail(@Body() data: RecordingDTO) {
    return await this.appService.recordingVoiceMail(data);
  }

  @Post('recording-status')
  recordingStatus(@Res() res: Response, @Body() recordingStatusDTO: RecordingStatusDTO){
    return this.appService.recordingStatus(res, recordingStatusDTO);
  }

  @Get('recordings')
  async getRecordings(){
    return await this.appService.getRecordings();
  }

  @Get('calls')
  async getCalls(){
    return await this.appService.getCallRecords();
  }

}
