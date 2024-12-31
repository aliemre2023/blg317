import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    host = "0.0.0.0"
    port = int(os.getenv("API_PORT", 5000))  # Default to port 5000
    app.run(host=host, port=port)
