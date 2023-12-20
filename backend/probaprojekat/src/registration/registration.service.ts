import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis-client/redis.service';
import { Registration } from './registration.entity';

@Injectable()
export class RegistrationService {
  constructor(private readonly redisService: RedisService) {}
  async createRegistration(registrationParam: Registration,PlayerUsername:string): Promise<void> {
    const registration = new Registration(
      registrationParam.TeamName,
      registrationParam.NumberOfHeadphones,
      registrationParam.NumberOfPCs,
      registrationParam.NumberOfKeyboards,
      registrationParam.NumberOfMouses,
      PlayerUsername
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
  async getAllRegistrationsFromPlayer(PlayerUsername:string)
  {
    const retArr=[];
    const redisClient=await this.redisService.getClient();
    const keys = await redisClient.keys(`registration:*`);
    const result=keys.map(async(k)=>{
      const value:any=await redisClient.get(k);
      const registration=JSON.parse(value);
      if (registration && registration.PlayerUsername === PlayerUsername) {
        console.log(registration);
        retArr.push(registration);
      }
    })
    return retArr;
  }
}
