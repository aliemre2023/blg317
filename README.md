This is an ITU BLG317 course database project. Developed with Next.js, Flask and SQLite.


## Getting Started

Install Dependencies with these commands.
```bash
make build
```

Run project with these commands.
```bash
make startall   #Runs both frontend and backend servers
```

Stop project with this command.
```bash
make stopall
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result after starting the frontend server.

Check the api from [http://127.0.0.1:5000/api](http://127.0.0.1:5000/api)  with your browser to see the result after starting the backend server.

You can find alternative commands in makefile and .vscode file.

## Database
The database created based on [https://www.kaggle.com/datasets/wyattowalsh/basketball](https://www.kaggle.com/datasets/wyattowalsh/basketball), but we change this database much. This is our database schema:

<p align="center"><img src="https://github.com/user-attachments/assets/2000cea9-aca1-488b-b7b5-ba45ad70bbcf" width="600px"></p>