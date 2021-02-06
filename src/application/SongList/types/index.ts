export interface ISongs {
  name: string;
  ar: { name: string }[];
  al: { name: string, picUrl: string };
  id: number;
  dt: number;
  accountId: string;
  picUrl: string;
  album: { name: string };
  artists: { name: string }[];
}
export interface ISongsProps {
  showBackground?: boolean;
  collectCount?: number;
  showCollect: boolean;
  songs: ISongs[];
  musicAnimation: (x: number, y: number) => void;
}