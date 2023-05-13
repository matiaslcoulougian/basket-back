import axios from 'axios';
import {HttpException, Injectable} from "@nestjs/common";

@Injectable()
export default class BallDontLieIntegration {
    async getPreviousSeasonMatches() {
        try {
            const res = await axios.get('https://www.balldontlie.io/api/v1/games?seasons[]=2018', {
                params: {
                    page: 0,
                    per_page: 100
                }
            });
            return res.data.data;
        }
        catch (e) {
            console.error(e)
            throw new HttpException("Error getting previous season matches", 409);
        }
    }
}