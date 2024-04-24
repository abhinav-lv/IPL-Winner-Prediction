// Import team images
import csk from "../assets/csk.png";
import dc from "../assets/dc.png";
import mi from "../assets/mi.png";
import kkr from "../assets/kkr.png";
import rcb from "../assets/rcb.png";
import kxip from "../assets/kxip.png";
import rr from "../assets/rr.png";
import lsg from "../assets/lsg.png";
import gt from "../assets/gt.png";
import srh from "../assets/srh.png";
import { ITeamsAndCities } from "./types";

export const teamToImages: { [key: string]: string } = {
  "Royal Challengers Bangalore": rcb,
  "Kolkata Knight Riders": kkr,
  "Delhi Capitals": dc,
  "Sunrisers Hyderabad": srh,
  "Mumbai Indians": mi,
  "Kings XI Punjab": kxip,
  "Gujarat Titans": gt,
  "Rajasthan Royals": rr,
  "Chennai Super Kings": csk,
  "Lucknow Supergiants": lsg,
};
export const teamToCities: { [key: string]: string } = {
  "Royal Challengers Bangalore": "Bangalore",
  "Kolkata Knight Riders": "Kolkata",
  "Delhi Capitals": "Delhi",
  "Sunrisers Hyderabad": "Hyderabad",
  "Mumbai Indians": "Mumbai",
  "Kings XI Punjab": "Dharamsala",
  "Gujarat Titans": "Ahmedabad",
  "Rajasthan Royals": "Jaipur",
  "Chennai Super Kings": "Chennai",
  "Lucknow Supergiants": "Kanpur",
};
// Get the teams and cities from the server to display as options
export const getTeamsAndCities = async (
  setTeamsAndCities: Function,
  setIsLoading: Function
) => {
  const res: ITeamsAndCities = await (
    await fetch("/api/getTeamsAndCities")
  ).json();
  setTeamsAndCities(res);
  setIsLoading(false);
};
