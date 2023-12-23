// import { Injectable } from '@nestjs/common';
// import { RedisService } from 'src/redis-client/redis.service';
// import { Registration } from './registration.entity';

// @Injectable()
// export class RegistrationService {
//   constructor(private readonly redisService: RedisService) {}
//   async createRegistration(
//     registrationParam: Registration,
//     PlayerId: string,
//   ): Promise<void> {

//   }
//   async getRegistration(registrationId: string): Promise<Registration | null> {
//     const key = `registration:${registrationId}`;
//     console.log(registrationId);
//     const registrationData = await this.redisService.get(key);
//     return registrationData ? JSON.parse(registrationData) : null;
//   }
//   async getAllRegistrationsFromPlayer(PlayerId: string) {
//     const retArr = [];
//     const redisClient = await this.redisService.getClient();
//     const keys = await redisClient.keys(`registration:*`);
//     const promises = keys.map(async (k) => {
//       const value: any = await redisClient.get(k);
//       const registration = JSON.parse(value);
//       if (registration && registration.PlayerId === PlayerId) {
//         retArr.push(registration);
//       }
//     });
//     await Promise.all(promises);
//     return retArr;
//   }
// }
