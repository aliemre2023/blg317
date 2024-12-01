from flask import Blueprint, request, jsonify
from app.utils.data_fetch import *

api_bp = Blueprint("api", __name__)

# API endpoint for countries
@api_bp.route('/countries', methods=['GET'])
def countries_api():
    query = request.args.get("name")
    page = int(request.args.get("page", 1))

    countries, total_countries = get_countries(query, page)

    return jsonify({
        'countries': [{'country_id': country[0], 'name': country[1], 'flag_link': country[2]} for country in countries],
        'page': page,
        'total_countries': total_countries
    })

@api_bp.route('/teams', methods=['GET'])
def teams_api():
    query = request.args.get("nickname") # !! search column 
    page = int(request.args.get("page", 1))

    teams, total_teams = get_teams(query, page)

    return jsonify({
        'teams': [
            {'team_id': team[0], 'abbreviation': team[1], 'nickname': team[2], 'logo_url': team[3]} 
            for team in teams
        ],
        'page': page,
        'total_teams': total_teams
    })

@api_bp.route('/players', methods=['GET'])
def players_api():
    query = request.args.get("name")  # !! Search across first_name and last_name
    page = int(request.args.get("page", 1))

    players, total_players = get_players(query, page)

    return jsonify({
        'players': [
            {
                'player_id': player[0],
                'first_name': player[1],
                'last_name': player[2],
                'height': player[3],
                'weight': player[4],
                'birth_date': player[5],
                'college': player[6],
                'country_id': player[7],
                'png_name' : player[8],
            }
            for player in players
        ],
        'page': page,
        'total_players': total_players
    })



@api_bp.route('/numberOfTeams', methods=['GET'])
def numberOfTeams_api():
    table = get_numberOfTeamsInCountry()

    return jsonify({
        'numberOfTeams': [{'country_id': row[0], 'country_name': row[1], 'team_count': row[2]} for row in table],
    })

@api_bp.route('/numberOfPlayers', methods=['GET'])
def numberOfPlayers_api():
    table = get_numberOfPlayersInCountry()

    return jsonify({
        'numberOfPlayers': [{'country_id': row[0], 'country_name': row[1], 'player_count': row[2]} for row in table],
    })


@api_bp.route('/getLastGames', methods=['GET'])
def getLastGames_api():
    # Get the limit parameter from the query string, default to 5
    limit = request.args.get('limit', default=5, type=int)
    games = getLastGames(limit)
        # Format games into a list of dictionaries for JSON response
    formatted_games = [
        {
            "game_id": game[0],
            "date": game[1],
            "home_team_id": game[2],
            "home_team_name": game[3],
            "home_team_score": game[4],
            "away_team_id": game[5],
            "away_team_name": game[6],
            "away_team_score": game[7],
            "official_name": game[8]
        }
        for game in games
    ]

    return jsonify(formatted_games)

@api_bp.route('/country/<int:country_id>/players', methods=['GET'])
def countryPlayers_api(country_id):
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    table, total_countryPlayers = get_countryPlayers(country_id, page, limit)

    return jsonify({
        'counrtyPlayers': [{'player_id': row[0], 'first_name': row[1], 'last_name': row[2], 'height': row[3], 'weight': row[4], 'birth_date': row[5], 'college': row[6]} for row in table],
        'page': page,
        'totalCountryPlayers': total_countryPlayers
    })

@api_bp.route('/country/<int:country_id>/teams', methods=['GET'])
def countryTeams_api(country_id):
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    table, total_countryTeams = get_countryTeams(country_id, page, limit)

    return jsonify({
        'counrtyTeams': [{'team_id': row[0], 'name': row[1], 'owner': row[2], 'general_manager': row[3], 'headcoach': row[4], 'city_name': row[5], 'arena_name': row[6], 'year_founded': row[7], 'instagram': row[8]} for row in table],
        'page': page,
        'totalCountryTeams': total_countryTeams
    })

@api_bp.route('/teams/<int:teamid>', methods = ['GET'])
def teamInfo_api(teamid):
    teamInfo = get_teamInfo(teamid)
    roster = get_activeRoster(teamid)
    return jsonify({
        'teamInfo' : [{'teamName' : teamInfo[1], 'abbreviation' : teamInfo[2] , 'foundedYear' : teamInfo[4], 'owner' : teamInfo[5], 'generalMan' : teamInfo[6], 'headCoach' : teamInfo[7], 'dTeam' : teamInfo[8], 'facebook' : teamInfo[9], 'instagram' : teamInfo[10], 'twitter' : teamInfo[11], 'logo' : teamInfo[12], 'city' : teamInfo[13], 'state' : teamInfo[17], 'arenaName' : teamInfo[18], 'arenaCapacity' : teamInfo[19]}],
        'activeRoster' : [{'jerseyNumber' : row[9], 'firstName' : row[2], 'lastName' : row[3], 'position' : row[10], 'height' : row[4]} for row in roster]
    })

if __name__ == '__main__':
    app.run(debug=True)
