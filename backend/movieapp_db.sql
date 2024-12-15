DROP TABLE IF EXISTS pinnedshow;
DROP TABLE IF EXISTS pinnedmovie;
DROP TABLE IF EXISTS account_user_group;
DROP TABLE IF EXISTS user_group;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS account;

/* Create account table, id autoincrement, password hashed */
CREATE TABLE account (
	id SERIAL PRIMARY KEY,
	uname VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL
);

/* Create favorite, there can be multiple
favorite movies for user, table cannot exists if no account related*/
CREATE TABLE favorite (
	id serial PRIMARY KEY,
	account_id INTEGER NOT NULL,
	movie_id INTEGER NOT NULL,
    movie_name VARCHAR(50),
	FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE
);

/* Create review, there can be multiple reviews
by user, but no review without user
*/
CREATE TABLE review (
	id SERIAL PRIMARY KEY,
	account_id INTEGER NOT NULL,
	movie_id INTEGER NOT NULL,
	review_title VARCHAR(100),
	review_body TEXT,
	stars INTEGER CHECK (stars BETWEEN 1 AND 5),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE
);

-- Create user_group table
CREATE TABLE user_group (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) UNIQUE NOT NULL,
    owner_id INTEGER,
    description TEXT,
    FOREIGN KEY (owner_id) REFERENCES account(id) ON DELETE SET NULL  -- Set null if owner deleted
);

-- Create account_user_group, connects account and user_group
CREATE TABLE account_user_group (
	id SERIAL,
    account_id INTEGER NOT NULL,          -- Reference to account table
    user_group_id INTEGER NOT NULL,       -- Reference to user_group table
	pending BOOLEAN DEFAULT TRUE,         -- Default TRUE, waiting for acceptance
    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY (user_group_id) REFERENCES user_group(id) ON DELETE CASCADE,
    PRIMARY KEY (account_id, user_group_id)  -- Prevent multiple same copies
);

CREATE TABLE pinnedmovie (
	id SERIAL PRIMARY KEY,
	group_id INTEGER NOT NULL,
	movie_id INTEGER NOT NULL,
	FOREIGN KEY (group_id) REFERENCES user_group(id) ON DELETE CASCADE,
	CONSTRAINT unique_movie_in_group UNIQUE (group_id, movie_id)
);

CREATE TABLE pinnedshow (
	id SERIAL PRIMARY KEY,
	group_id INTEGER NOT NULL,
	movie_id INTEGER NOT NULL,
	area_id INTEGER NOT NULL,
    showdate TIMESTAMP,
	FOREIGN KEY (group_id) REFERENCES user_group(id) ON DELETE CASCADE,
	CONSTRAINT unique_show_in_group UNIQUE (group_id, movie_id)
);

/* Insert data for testing*/

/* Account data */
INSERT INTO account (uname, password) Values ('Maverick', 'Maverick123');
INSERT INTO account (uname, password) Values ('Merlin', 'Merlin123');
INSERT INTO account (uname, password) Values ('Charlie', 'Charlie123');
INSERT INTO account (uname, password) Values ('Goose', 'Goose123');
INSERT INTO account (uname, password) Values ('Viper', 'Viper123');
INSERT INTO account (uname, password) Values ('Jester', 'Jester123');
INSERT INTO account (uname, password) Values ('Cougar', 'Cougar123');

/* Account favorite data */

INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (1, 744, 'Top Gun');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (1, 680, 'Pulp Fiction');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (1, 238, 'The Godfather');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (2, 680, 'Pulp Fiction');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (3, 8587, 'The Lion King');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (4, 747, 'Shaun of the Dead');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (5, 747, 'Shaun of the Dead');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (5, 744, 'Top Gun');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (6, 680, 'Pulp Fiction');
INSERT INTO favorite (account_id, movie_id, movie_name) VALUES (6, 238, 'The Godfather');

/* Account review data */

INSERT INTO review (account_id, movie_id, review_title, review_body, stars) VALUES (1, 744, 'Top Gun', 'Great movie!', 5);
INSERT INTO review (account_id, movie_id, review_title, review_body, stars) VALUES (1, 680, 'Pulp Fiction', 'Great movie!', 5);
INSERT INTO review (account_id, movie_id, review_title, review_body, stars) VALUES (2, 680, 'My opinion of Pulp Fiction...', 'BEST MOVIE EVER!!!', 5);
INSERT INTO review (account_id, movie_id, review_title, review_body, stars) VALUES (3, 744, 'Top Gun? More like Flop Gun', 'Tom Cruise sucks', 1);

/* User_group data */

INSERT INTO user_group (group_name, owner_id, description) VALUES ('TestGroup', 1, 'Test group for testing');
INSERT INTO user_group (group_name, owner_id, description) VALUES ('Top 5 Movies', 2, 'My top 5 movies');
INSERT INTO user_group (group_name, owner_id, description) VALUES ('Best movies group', 3, 'Collection of the best movies');
INSERT INTO user_group (group_name, owner_id, description) VALUES ('Worst movies group', 3, 'Collection of the worst movies');

/* Account_user_group data */

INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (1, 1, FALSE);
INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (4, 1, FALSE);
INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (7, 1, FALSE);
INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (2, 2, FALSE);
INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (2, 1, TRUE);
INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (3, 1, FALSE);
INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (2, 3, TRUE);
INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES (3, 3, FALSE);

INSERT INTO pinnedmovie (group_id, movie_id) VALUES (1, 744);
INSERT INTO pinnedmovie (group_id, movie_id) VALUES (1, 680);
INSERT INTO pinnedmovie (group_id, movie_id) VALUES (1, 238);
INSERT INTO pinnedmovie (group_id, movie_id) VALUES (2, 680);
INSERT INTO pinnedmovie (group_id, movie_id) VALUES (3, 8587);
INSERT INTO pinnedmovie (group_id, movie_id) VALUES (3, 747);