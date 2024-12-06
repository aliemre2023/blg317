from flask import Blueprint, request, jsonify
from app.utils.data_fetch import *
from app.api import generate_hashPassword

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

@api_bp.route('/players/<int:player_id>', methods=["GET"])
def playerInfo_api(player_id):
    player_infos = get_playerInfo(player_id)
    return jsonify({'name' : player_infos[0]+" "+player_infos[1],
                    'height' : player_infos[2],
                    'weight' : player_infos[3],
                    'birthDate' : player_infos[4],
                    'college' : player_infos[5],
                    'country' : player_infos[6],
                    'country_flag' : player_infos[7],
                    'player_img' : player_infos[8],
                    'team_name' : player_infos[9],
                    'team_logo' : player_infos[10],
                    'active_player' : player_infos[11],
                    'position' : player_infos[12],
                    'start_year' : player_infos[13],
                    'end_year' : player_infos[14],
                    'jersey_number' : player_infos[15],
                    'draft_year' : player_infos[16],
                    'overall_pick' : player_infos[17],
                    'country_id' : player_infos[18],
                    'team_id' : player_infos[19]})


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
    last5Games = getLastGames(5, teamid)
    return jsonify({
        'teamInfo' : [{'teamName' : teamInfo[1], 'abbreviation' : teamInfo[2] , 'foundedYear' : teamInfo[4], 'owner' : teamInfo[5], 'generalMan' : teamInfo[6], 'headCoach' : teamInfo[7], 'dTeam' : teamInfo[8], 'facebook' : teamInfo[9], 'instagram' : teamInfo[10], 'twitter' : teamInfo[11], 'logo' : teamInfo[12], 'city' : teamInfo[13], 'state' : teamInfo[17], 'arenaName' : teamInfo[18], 'arenaCapacity' : teamInfo[19]}],
        'activeRoster' : [{'jerseyNumber' : row[9], 'firstName' : row[2], 'lastName' : row[3], 'position' : row[10], 'height' : row[4]} for row in roster],
        'last5Games' : [{'date' : game[1], 'home_team_name' : game[3], 'home_team_score' : game[4], 'away_team_name' : game[6], 'away_team_score' : game[7], 'official_name' : game[8]} for game in last5Games]
    })


@api_bp.route('/register', methods=['POST'])
def register_user():
    print("Request received for user registration.")
    try:
        # Get the JSON data from the request
        # request already defined in flask 
        data = request.json
        print(data)
        if not data:
            return jsonify({'error': 'Request must be JSON'}), 400

        # Extract user details from the data
        user_name = data.get('user_name')
        password = data.get('password')
        mail = data.get('mail')
        is_admin = data.get('is_admin', False)

        # Validate required fields
        if not user_name or not password or not mail:
            return jsonify({'error': 'All fields (user_name, password, mail) are required'}), 400

        # Hash the password
        hash_password = generate_hashPassword(password)

        # Insert user into the database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (user_name, password, mail, is_admin)
            VALUES (?, ?, ?, ?)
        """, (user_name, hash_password, mail, is_admin))

        # Commit the transaction and close the connection
        conn.commit()
        conn.close()

        return jsonify({'message': 'User registered successfully'}), 201

    except sqlite3.IntegrityError as e:
        return jsonify({'error': 'User already exists or invalid data provided', 'details': str(e)}), 400

    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
