--- load with
--- sqlite3 database.db < schema.sql
CREATE TABLE appuser (
	id VARCHAR(20),
	password VARCHAR(20),
	name VARCHAR(20)
);

CREATE TABLE userScores (
	id VARCHAR(20),
	score INTEGER,
	time VARCHAR(20),
	FOREIGN KEY(id) REFERENCES appuser(id)
);
-- INSERT INTO appuser VALUES("0","","");
