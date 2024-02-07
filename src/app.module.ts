import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordingSchema } from './model/recordings.model';
import { CallRecordSchema } from './model/call.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://shabhihassan:oTc3FDQuaRFYKhc0@cluster0.evc1aof.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: 'Recording', schema: RecordingSchema },
      { name: 'CallRecord', schema: CallRecordSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
