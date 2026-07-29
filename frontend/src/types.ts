export type toggeler = "login"|"register"

export type Genre = "COMEDY" | "THRILLER" | "DRAMA" | "HORROR" | "ANIMATED" | "ACTION" | "OTHERS"

export type Movies = {
    id: string;
    imagePath: string;
    title: string;
    description: string | null;
    genre: Genre;
    duration: number;
    featured: boolean;
}

export interface ScreenInfo {
  id: string;
  name: string;
}

export interface GroupedShowtime {
  id: string;
  startTime: string | Date;
  screen: ScreenInfo;
}

export interface TheaterWithShowtimes {
  id: string;
  name: string;
  location: string;
  showtimes: GroupedShowtime[];
}

export interface GroupedMovieDetails {
  id: string;
  title: string;
  description: string | null;
  genre: Genre;
  duration: number;
  imagePath: string;
  featured: boolean;
  theaters: TheaterWithShowtimes[];
}
// 5. State/Prop wrapper (Nullable)
export type MovieDetailsState = GroupedMovieDetails | null;