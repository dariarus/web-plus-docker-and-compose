import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { Offer } from '../offers/entities/offer.entity';

import { APP_DB_HOST } from '../config';

export default () => ({
  database: {
    type: 'postgres',
    host: APP_DB_HOST,
    port: 5432,
    username: 'student',
    password: 'student',
    database: 'kupipodariday',
    entities: [User, Wish, Wishlist, Offer],
    synchronize: true,
    logging: ['query'],
  },
});
