import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, CategoryModule, ProductModule, UsersModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
