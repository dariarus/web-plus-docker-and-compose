import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';
import { PublicOfferDto } from './dto/public-offer.dto';
import { JwtGuard } from '../auth/passport/jwt.guard';
import { EmailSenderService } from '../email-sender/email-sender.service';

@UseGuards(JwtGuard)
@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailService: EmailSenderService,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    return this.offersRepository.save(createOfferDto);
  }

  async createOne(
    offer: CreateOfferDto,
    userId: number,
  ): Promise<PublicOfferDto> {
    const currentUser = await this.usersRepository.findOneBy({ id: userId });
    const wish = await this.wishesRepository.findOne({
      where: { id: offer.itemId },
      relations: ['offers', 'owner', 'offers.user'],
    });
    console.log(wish);
    if (!wish) {
      throw new ForbiddenException('Такое желание не найдено');
    }
    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные желания',
      );
    }
    const newOffer = {
      ...offer,
      item: wish,
      user: currentUser,
    };
    delete newOffer.itemId;
    const sum: number =
      wish.offers.reduce((acc, cur) => acc + cur.amount, 0) + offer.amount;
    if (sum > wish.price) {
      throw new ForbiddenException(
        'Сумма средств не может превышать стоимость подарка',
      );
    } else if (sum === wish.price) {
      const emails = wish.offers.map((offer) => offer.user.email);
      emails.push(currentUser.email);
      const uniqueEmails = [...new Set(emails)];
      await this.mailService.sendEmail(
        uniqueEmails,
        'Сумма собрана!',
        '',
        `<img src="${wish.image}" alt="Изображение подарка">
                      <h1>Поздравляем! Сумма на подарок собрана!</h1>
                      <p>Ссылка на подарок в магазине: <a href=${wish.link}></a></p>
                      <p>Вот список пользователей, которые помогли собрать средства: ${uniqueEmails}</p>`,
      );
    }
    wish.raised = Math.round(sum * 1000) / 1000;
    await this.wishesRepository.update(wish.id, {
      raised: sum,
    });
    const createdOffer = await this.create(newOffer);
    return {
      ...createdOffer,
      user: UserPublicProfileResponseDto.getFromUser(currentUser),
    };
  }

  async findAll(userId: number): Promise<Offer[]> {
    return this.offersRepository.findBy({
      user: {
        id: userId,
      },
    });
  }

  async findOne(id: number, userId: number): Promise<PublicOfferDto> {
    const offer = await this.offersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });
    if (offer.user.id !== userId) {
      throw new UnauthorizedException();
    }
    return {
      ...offer,
      user: UserPublicProfileResponseDto.getFromUser(offer.user),
    };
  }

  async updateOne(id: number, offer: UpdateOfferDto) {
    return this.offersRepository.update(id, offer);
  }

  async removeOne(id: number) {
    await this.offersRepository.delete(id);
  }
}
