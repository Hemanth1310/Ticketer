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
export type SeatTypes = "SILVER" | "GOLD" | "PLATINUM"
export type Seat={
    number: number;
    id: string;
    screenId: string;
    type: SeatTypes;
    row: string;
    price: number;
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

export type Showtime = {
      id: string;
      screenId: string;
      startTime: Date;
      movieId: string;
      basePrice: number;
      movie:Movies
}

type BookingStatus = "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "FAILED"


export type BookingDetails= {
    seats: {
        number: number;
        id: string;
        screenId: string;
        row: string;
        type: SeatTypes;
    }[];
    location: string;
    theater: string;
    showtime: {
        id: string;
        startTime: Date;
        movieId: string;
        screenId: string;
        basePrice: number;
    };
    movie: {
        id: string;
        title: string;
        description: string | null;
        genre: Genre;
        duration: number;
        imagePath: string;
        featured: boolean;
    };
    id: string;
    userId: string;
    showtimeId: string;
    ticketPrice: number;
    convenienceFee: number;
    totalAmount: number;
    paymentId: string | null;
    bookedAt: Date;
    status: BookingStatus;
    screen:string;
}