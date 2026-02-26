import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';

@Module({
  providers: [AttachmentService],
  controllers: [AttachmentController],
  imports: [TypeOrmModule.forFeature([Attachment])],
})
export class AttachmentModule {}
