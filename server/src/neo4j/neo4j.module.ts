import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Driver => {
        const uri = configService.get<string>('NEO4J_URI');
        const username = configService.get<string>('NEO4J_USERNAME');
        const password = configService.get<string>('NEO4J_PASSWORD');

        return neo4j.driver(uri, neo4j.auth.basic(username, password));
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}
