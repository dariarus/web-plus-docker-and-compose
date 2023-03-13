import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { Offer } from '../offers/entities/offer.entity';

import { POSTGRES_HOST } from '../config';

export default () => ({
  database: {
    type: 'postgres',
    host: POSTGRES_HOST,
    port: 5432,
    username: 'student',
    password: 'student',
    database: 'kupipodariday',
    entities: [User, Wish, Wishlist, Offer],
    synchronize: true,
    logging: ['query'],
  },
});
