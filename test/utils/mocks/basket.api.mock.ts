import BallDontLieIntegration from "../../../src/integration/ball.dont.lie.integration";

export class BasketApiMock extends BallDontLieIntegration {
    override async getPreviousSeasonMatches(){
        return [
            {
                id: 47179,
                date: "2019-01-30T00:00:00.000Z",
                home_team: {
                    id: 2,
                    abbreviation: "BOS",
                    city: "Boston",
                    conference: "East",
                    division: "Atlantic",
                    full_name: "Boston Celtics",
                    name: "Celtics"
                },
                home_team_score: 126,
                period: 4,
                postseason: false,
                season: 2018,
                status: "Final",
                time: " ",
                visitor_team: {
                    id: 4,
                    abbreviation: "CHA",
                    city: "Charlotte",
                    conference: "East",
                    division: "Southeast",
                    full_name: "Charlotte Hornets",
                    name: "Hornets"
                },
                visitor_team_score: 94
            },
            {
                id: 48751,
                date: "2019-02-09T00:00:00.000Z",
                home_team: {
                    id: 2,
                    abbreviation: "BOS",
                    city: "Boston",
                    conference: "East",
                    division: "Atlantic",
                    full_name: "Boston Celtics",
                    name: "Celtics"
                },
                home_team_score: 112,
                period: 4,
                postseason: false,
                season: 2018,
                status: "Final",
                time: "     ",
                visitor_team: {
                    id: 13,
                    abbreviation: "LAC",
                    city: "LA",
                    conference: "West",
                    division: "Pacific",
                    full_name: "LA Clippers",
                    name: "Clippers"
                },
                visitor_team_score: 123
            },
            {
                id: 48739,
                date: "2019-02-08T00:00:00.000Z",
                home_team: {
                    id: 23,
                    abbreviation: "PHI",
                    city: "Philadelphia",
                    conference: "East",
                    division: "Atlantic",
                    full_name: "Philadelphia 76ers",
                    name: "76ers"
                },
                home_team_score: 117,
                period: 4,
                postseason: false,
                season: 2018,
                status: "Final",
                time: "     ",
                visitor_team: {
                    id: 8,
                    abbreviation: "DEN",
                    city: "Denver",
                    conference: "West",
                    division: "Northwest",
                    full_name: "Denver Nuggets",
                    name: "Nuggets"
                },
                visitor_team_score: 110
            },
            {
                id: 48740,
                date: "2019-02-08T00:00:00.000Z",
                home_team: {
                    id: 30,
                    abbreviation: "WAS",
                    city: "Washington",
                    conference: "East",
                    division: "Southeast",
                    full_name: "Washington Wizards",
                    name: "Wizards"
                },
                home_team_score: 119,
                period: 4,
                postseason: false,
                season: 2018,
                status: "Final",
                time: "     ",
                visitor_team: {
                    id: 6,
                    abbreviation: "CLE",
                    city: "Cleveland",
                    conference: "East",
                    division: "Central",
                    full_name: "Cleveland Cavaliers",
                    name: "Cavaliers"
                },
                visitor_team_score: 106
            }
        ]
    }
}

export const basketApiMock =  new BasketApiMock();
