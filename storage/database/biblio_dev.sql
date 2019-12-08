DROP DATABASE IF EXISTS biblio_dev;
CREATE DATABASE biblio_dev CHARACTER SET UTF8mb4 COLLATE utf8mb4_bin;
SET NAMES utf8mb4;
USE biblio_dev;

CREATE TABLE user (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE product (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    notes TEXT NULL,
    fk_user INT UNSIGNED NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT product_fk_user FOREIGN KEY (fk_user) REFERENCES user (id),
    CONSTRAINT uc_product UNIQUE (name, fk_user)
);

CREATE TABLE supplier (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    website VARCHAR(200) NOT NULL,
    notes TEXT NULL,
    fk_user INT UNSIGNED NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT supplier_fk_user FOREIGN KEY (fk_user) REFERENCES user (id),
    CONSTRAINT uc_product UNIQUE (name, fk_user)
);

CREATE TABLE at_product_supplier (
    fk_product INT UNSIGNED NOT NULL,
    fk_supplier INT UNSIGNED NOT NULL,
    fk_user INT UNSIGNED NOT NULL,
    notes TEXT NULL,
    PRIMARY KEY (fk_product, fk_supplier, fk_user),
    CONSTRAINT at_product_supplier_fk_product FOREIGN KEY (fk_product) REFERENCES product (id),
    CONSTRAINT at_product_supplier_fk_supplier FOREIGN KEY (fk_supplier) REFERENCES supplier (id),
    CONSTRAINT at_product_supplier_fk_user FOREIGN KEY (fk_user) REFERENCES user (id)
);

INSERT INTO user (firstname, lastname, email, password, creation_date)
VALUES
    ("John", "Doe", "johndoe@gmail.com", "$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.", "2019-11-24 00:00:00");

INSERT INTO product (name, notes, fk_user, creation_date)
VALUES
    ("insert fileté", "notes", "1", "2019-11-24 00:00:00"),
    ("insert fileté 2", "notes", "1", "2019-11-24 00:00:00");

INSERT INTO supplier (name, website, notes, fk_user, creation_date)
VALUES
    ("rs-online", "https://fr.rs-online.com", "notes", "1", "2019-11-24 00:00:00"),
    ("rs-online-2", "https://fr.rs-online-2.com", "notes", "1", "2019-11-24 00:00:00");

INSERT INTO at_product_supplier (fk_product, fk_supplier, fk_user, notes)
VALUES
    ("1", "1", "1", "notes"),
    ("2", "1", "1", "notes");

DELIMITER //

CREATE PROCEDURE reset_tables()

BEGIN
	ALTER TABLE product
	DROP FOREIGN KEY product_fk_user;

	ALTER TABLE supplier
	DROP FOREIGN KEY supplier_fk_user;

	ALTER TABLE at_product_supplier
	DROP FOREIGN KEY at_product_supplier_fk_product,
	DROP FOREIGN KEY at_product_supplier_fk_supplier,
	DROP FOREIGN KEY at_product_supplier_fk_user;

	TRUNCATE TABLE product;
	TRUNCATE TABLE supplier;
	TRUNCATE TABLE at_product_supplier;
    TRUNCATE TABLE user;

    ALTER TABLE product
	ADD CONSTRAINT product_fk_user FOREIGN KEY (fk_user) REFERENCES user (id);

	ALTER TABLE supplier
	ADD CONSTRAINT supplier_fk_user FOREIGN KEY (fk_user) REFERENCES user (id);

	ALTER TABLE at_product_supplier
	ADD CONSTRAINT at_product_supplier_fk_product FOREIGN KEY (fk_product) REFERENCES product (id),
	ADD CONSTRAINT at_product_supplier_fk_supplier FOREIGN KEY (fk_supplier) REFERENCES supplier (id),
    ADD CONSTRAINT at_product_supplier_fk_user FOREIGN KEY (fk_user) REFERENCES user (id);

    INSERT INTO user (firstname, lastname, email, password, creation_date)
    VALUES
        ("John", "Doe", "johndoe@gmail.com", "$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.", "2019-11-24 00:00:00");

    INSERT INTO product (name, notes, fk_user, creation_date)
    VALUES
        ("insert fileté", "notes", "1", "2019-11-24 00:00:00"),
        ("insert fileté 2", "notes", "1", "2019-11-24 00:00:00");

    INSERT INTO supplier (name, website, notes, fk_user, creation_date)
    VALUES
        ("rs-online", "https://fr.rs-online.com", "notes", "1", "2019-11-24 00:00:00"),
        ("rs-online-2", "https://fr.rs-online-2.com", "notes", "1", "2019-11-24 00:00:00");

    INSERT INTO at_product_supplier (fk_product, fk_supplier, fk_user, notes)
    VALUES
        ("1", "1", "1", "notes"),
        ("2", "1", "1", "notes");
END //

DELIMITER ;