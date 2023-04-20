const axios = require('axios')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createPlayers() {
    await prisma.team.createMany({
        data: [
            {
                name: 'Atlanta Hawks',
            },
            {
                name: 'Boston Celtics',
            },
            {
                name: 'Brooklyn Nets',
            },
            {
                name: 'Charlotte Hornets',
            },
            {
                name: 'Chicago Bulls',
            },
            {
                name: 'Cleveland Cavaliers',
            },
            {
                name: 'Dallas Mavericks',
            },
            {
                name: 'Denver Nuggets',
            },
            {
                name: 'Detroit Pistons',
            },
            {
                name: 'Golden State Warriors',
            },
            {
                name: 'Houston Rockets',
            },
            {
                name: 'Indiana Pacers',
            },
            {
                name: 'Los Angeles Clippers',
            },
            {
                name: 'Los Angeles Lakers',
            },
            {
                name: 'Memphis Grizzlies',
            },
            {
                name: 'Miami Heat',
            },
            {
                name: 'Milwaukee Bucks',
            },
            {
                name: 'Minnesota Timberwolves',
            },
            {
                name: 'New Orleans Pelicans',
            },
            {
                name: 'New York Knicks',
            },
            {
                name: 'Oklahoma City Thunder',
            },
            {
                name: 'Orlando Magic',
            },
            {
                name: 'Philadelphia 76ers',
            },
            {
                name: 'Phoenix Suns',
            },
            {
                name: 'Portland Trail Blazers',
            },
            {
                name: 'Sacramento Kings',
            },
            {
                name: 'San Antonio Spurs',
            },
            {
                name: 'Toronto Raptors',
            },
            {
                name: 'Utah Jazz',
            },
            {
                name: 'Washington Wizards',
            },
        ]
    })
    const teams = await prisma.team.findMany()

    const players = await axios.get('https://www.balldontlie.io/api/v1/players', {
        params: {
            page: 0,
            per_page: 100
        }
    }).then(res => res.data.data.map((player) => {
        return {
            name: player.first_name + ' ' + player.last_name,
            teamName: player.team.full_name
        }
    }))

    for (const team of teams) {
        const playersData = []
        const teamPlayers = players.filter(player => player.teamName === team.name)
        for (const teamPlayer of teamPlayers) {
            playersData.push({ name: teamPlayer.name, teamId: team.id })
        }

        await prisma.player.createMany({
            data: playersData
        })
    }

    console.log('Players created successfully')
}

createPlayers()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect())
