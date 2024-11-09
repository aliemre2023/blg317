from flask import Flask, request, jsonify
from flask_cors import CORS

from data_fetch import get_countries

app = Flask(__name__)
CORS(app)

# API endpoint for countries
@app.route('/api/countries', methods=['GET'])
def countries_api():
    query = request.args.get("name")
    page = int(request.args.get("page", 1))

    countries, total_pages = get_countries(query, page)

    return jsonify({
        'countries': [{'name': country[0], 'flag_link': country[1]} for country in countries],
        'page': page,
        'total_pages': total_pages
    })

if __name__ == '__main__':
    app.run(debug=True)
