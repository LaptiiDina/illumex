import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  async getGraph() {
    return this.graphService.getGraph();
  }

  @Post('vote')
  async vote(@Body() body: { title: string; score: number }) {
    return this.graphService.voteForMovie(body.title, body.score);
  }

  @Get('omdb')
  async getOmdbRating(@Query('title') title: string) {
    return this.graphService.getOmdbRating(title);
  }

  @Get('search')
  async search(@Query('title') title: string) {
    return this.graphService.searchGraph(title);
  }
}
