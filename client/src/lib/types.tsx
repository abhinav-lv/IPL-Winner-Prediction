export interface ITeamsAndCities {
  teams: string[];
  cities: string[];
}
export interface IResult {
  probabilities: {
    battingTeam: number;
    bowlingTeam: number;
  };
}
