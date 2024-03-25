import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Artist, { onDelete: 'SET NULL' })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Track, { onDelete: 'SET NULL' })
  @JoinTable()
  tracks: Track[];

  @ManyToMany(() => Album, { onDelete: 'SET NULL' })
  @JoinTable()
  albums: Album[];
}
