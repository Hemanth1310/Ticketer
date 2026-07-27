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