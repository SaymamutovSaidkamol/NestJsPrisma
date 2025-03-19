import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(data: RegisterDto) {
    let checkUser = await this.prisma.users.findFirst({
      where: { fullName: data.fullName },
    });

    if (checkUser) {
      throw new BadRequestException('This user alredy exist');
    }
    let hashPass = bcrypt.hashSync(data.password, 7);

    data.password = hashPass;

    let newUser = await this.prisma.users.createMany({ data });

    return { message: 'Register Successfully', data: newUser };
  }

  async login(data: LoginDto) {
    let checkUser = await this.prisma.users.findFirst({
      where: { email: data.email },
    });

    if (!checkUser) {
      throw new NotFoundException('User Not Found');
    }

    let chechPass = bcrypt.compareSync(data.password, checkUser.password);

    if (!chechPass) {
      throw new NotFoundException('Wrong Password');
    }

    let token = this.jwtService.sign({
      id: checkUser.id,
      name: checkUser.fullName,
      Ip: data.IP,
      role: checkUser.role,
    });

    let IpCheck = await this.prisma.iP.findFirst({
      where: { ID_Adress: data.IP, userId: checkUser.id },
    });

    if (!IpCheck) {
      console.log(
        `Yangi IP-manzil qo‘shilmoqda: ${data.IP} - User: ${checkUser.id}`,
      );

      await this.prisma.iP.create({
        data: {
          ID_Adress: data.IP,
          userId: checkUser.id,
        },
      });
    }

    let verifyToken = this.jwtService.verify(token);

    return { token, verifyToken };
  }

  async getMe(req: Request) {
    let { id } = req['user'];

    let all = await this.prisma.iP.findMany({
      where: { userId: id },
      include: { user: true },
    });

    return { data: all };
  }

  async findAll() {
    let all = await this.prisma.users.findMany({
      include: { ip: true },
    });
    return { data: all };
  }

  async findOne(id: string) {
    let OneCateg = await this.prisma.users.findFirst({
      where: { id },
      include: { ip: true },
    });

    if (!OneCateg) {
      throw new NotFoundException('Users Not Found');
    }

    return { data: OneCateg };
  }

  async remove(id: string, req: Request) {
    console.log(req['user']);

    if (req['user'].id !== id || req['user'].role !== 'ADMIN') {
      throw new BadRequestException(
        'You cannot send your information to someone else.',
      );
    }

    let OneCateg = await this.prisma.users.findFirst({ where: { id } });

    if (!OneCateg) {
      throw new NotFoundException('Users Not Found');
    }

    let del = await this.prisma.users.delete({ where: { id } });

    return { data: del };
  }
}
