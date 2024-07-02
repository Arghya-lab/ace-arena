import { IGame } from "@/@types/game";

const games: IGame[] = [
  {
    id: 1,
    name: "Twenty 9",
    posterUrl: "/posters/twenty-9-card-poster.jpg",
    tables: [
      {
        name: "Play With Friends",
        playingUrl: "/game/twenty-9/play-with-friends",
      },
      // {
      //   name: "Join Private Table",
      //   playingUrl: "/game/twenty-9/private",
      // },
    ],
  },
  // {
  //   id: 2,
  //   name: "Bridge",
  //   posterUrl: "/posters/bridge-card-poster.jpg",
  //   tables: [
  //     {
  //       name: "Play With Friends",
  //       playingUrl: "/game/bridge/play-with-friends",
  //     },
  //     {
  //       name: "Join Private Table",
  //       playingUrl: "/game/bridge/private",
  //     },
  //   ],
  // },
];
export default games;
