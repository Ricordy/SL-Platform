/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Kanit", ...defaultTheme.fontFamily.sans],
        serif: ["Italiana", ...defaultTheme.fontFamily.serif],
        ubuntu: ["Ubuntu", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ogBlack: "#535955",
        dreamBlack: "#011013",
        pureWhite: "#ffffff",
        badgeInProgressBackground: "#FFF4CF",
        badgeInProgressText: "#C78F00",
        offSand: "c1b7aa",
        classicLeather: "#443933",
        classicGreen: "#3a4842",
        lightGrey: "#dadada",
        mediumGrey: "#a2a2a2",
        primaryGreen: "#147454",
        primaryGold: "#C3A279",
        primaryGrey: "#757C79",
        secondaryGrey: "#535955",
        progressHighlight: "#2AD99F",
        progressBackground: "#DBDBDB",
        contactBackground: "#F7F7F7",
        buyNFTBackground: "#1E1B16",
        myInvestmentsBackground: "#161616",
        progressActiveBackground: "#2BDA9F",

        // tabInactive: "#757C79",
        tabInactive: "#8C9592",
        puzzleProfitNotice: "#F6F9F8",
      },
    },
  },
  plugins: [],
};
