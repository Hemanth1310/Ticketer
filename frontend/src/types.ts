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

export interface ShowtimeInfo {
  id: string;
  startTime: string | Date;
  timeLabel:string;
  screen: ScreenInfo;
}

export interface TheaterWithShowtimes {
  id: string;
  name: string;
  location: string;
  showtimes: ShowtimeInfo[];
}

export interface DateGroup {
  date: string; // "YYYY-MM-DD"
  theaters: TheaterWithShowtimes[];
}

export interface GroupedMovieDetails {
  id: string;
  title: string;
  description: string | null;
  genre: string;
  duration: number;
  imagePath: string;
  featured: boolean;
  dates: DateGroup[];
}

// 5. State/Prop wrapper (Nullable)
export type MovieDetailsState = GroupedMovieDetails | null;

export type Seat={
    number: number;
    id: string;
    screenId: string;
    type: string;
    row: string;
}

export type ScreenWithSeats = {
    theaterID:string;
    seats: Seat[]
} & ScreenInfo

export type ShowTimeData = {
      id: string;
  startTime: string | Date,
  movieId:string,
  screenId:string,
    screen:ScreenWithSeats
} 
