import { stats } from "../data/mockData.js";

export function getStats(_request, response) {
  response.json(stats);
}
