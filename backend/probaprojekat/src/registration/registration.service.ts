import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis-client/redis.service';
import { Registration } from './registration.entity';

@Injectable()
export class RegistrationService {
  constructor(private readonly redisService: RedisService) {}
  async createRegistration(registrationParam: Registration): Promise<void> {
    const registration = new Registration(
      registrationParam.TeamName,
      registrationParam.NumberOfHeadphones,
      registrationParam.NumberOfPCs,
      registrationParam.NumberOfKeyboards,
      registrationParam.NumberOfMouses,
    );
    const key = `registration:${registration.Id}`;
    await this.redisService.set(key, JSON.stringify(registration));
  }
  async getRegistration(registrationId: string): Promise<Registration | null> {
    const key = `registration:${registrationId}`;
    console.log(registrationId);
    const registrationData = await this.redisService.get(key);
    return registrationData ? JSON.parse(registrationData) : null;
  }
}
