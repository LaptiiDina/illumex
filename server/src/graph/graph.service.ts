import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Driver } from 'neo4j-driver';

@Injectable()
export class GraphService {
  constructor(
    @Inject('NEO4J_DRIVER') private readonly driver: Driver,
    private readonly configService: ConfigService,
  ) {}

  async getGraph() {
    const session = this.driver.session();

    try {
      const result = await session.run(`
        MATCH (p:Person)-[r]->(m:Movie)
        RETURN p, r, m
        LIMIT 100
      `);

      const nodes = new Map<string, any>();
      const links: any[] = [];

      result.records.forEach((record) => {
        const person = record.get('p');
        const movie = record.get('m');
        const rel = record.get('r');

        nodes.set(person.identity.toString(), {
          id: person.identity.toString(),
          label: person.labels[0],
          properties: person.properties,
        });

        nodes.set(movie.identity.toString(), {
          id: movie.identity.toString(),
          label: movie.labels[0],
          properties: {
            ...movie.properties,
            rating: Number(movie.properties.rating ?? 0),
            voteCount: movie.properties.voteCount?.toNumber?.() ?? 0,
          },
        });

        links.push({
          source: person.identity.toString(),
          target: movie.identity.toString(),
          type: rel.type,
        });
      });

      return {
        nodes: Array.from(nodes.values()),
        links,
      };
    } finally {
      await session.close();
    }
  }

  async voteForMovie(title: string, score: number) {
    const session = this.driver.session();

    try {
      const result = await session.run(
        `
        MATCH (m:Movie {title: $title})
        SET m.voteCount = coalesce(m.voteCount, 0) + 1,
            m.totalScore = coalesce(m.totalScore, 0) + $score
        SET m.rating = m.totalScore / m.voteCount
        RETURN m
        `,
        { title, score },
      );

      const movie = result.records[0]?.get('m');

      if (!movie) {
        throw new Error('Movie not found');
      }

      return {
        title: movie.properties.title,
        rating: Number(movie.properties.rating ?? 0),
        voteCount: movie.properties.voteCount?.toNumber?.() ?? 0,
      };
    } finally {
      await session.close();
    }
  }

  async getOmdbRating(title: string) {
    const apiKey = this.configService.get<string>('OMDB_API_KEY');
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    return {
      title: data.Title,
      year: data.Year,
      imdbRating: Number(data.imdbRating),
      genre: data.Genre,
      plot: data.Plot,
    };
  }

  async searchGraph(title: string) {
    const session = this.driver.session();

    try {
      const result = await session.run(
        `
        MATCH (p:Person)-[r]->(m:Movie)
        WHERE toLower(m.title) CONTAINS toLower($title)
        RETURN p, r, m
        LIMIT 100
        `,
        { title },
      );

      const nodes = new Map<string, any>();
      const links: any[] = [];

      result.records.forEach((record) => {
        const person = record.get('p');
        const movie = record.get('m');
        const rel = record.get('r');

        nodes.set(person.identity.toString(), {
          id: person.identity.toString(),
          label: person.labels[0],
          properties: person.properties,
        });

        nodes.set(movie.identity.toString(), {
          id: movie.identity.toString(),
          label: movie.labels[0],
          properties: {
            ...movie.properties,
            rating: Number(movie.properties.rating ?? 0),
            voteCount: movie.properties.voteCount?.toNumber?.() ?? 0,
          },
        });

        links.push({
          source: person.identity.toString(),
          target: movie.identity.toString(),
          type: rel.type,
        });
      });

      return {
        nodes: Array.from(nodes.values()),
        links,
      };
    } finally {
      await session.close();
    }
  }
}
