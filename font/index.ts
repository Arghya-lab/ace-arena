import { Maven_Pro, Patua_One } from "next/font/google";

export const mavinPro = Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-maven_pro",
});

export const patuaOne = Patua_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-patua_one",
});
