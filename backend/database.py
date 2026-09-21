import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    """
    Create and return a MySQL database connection.
    """

    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE")
        )

        return connection

    except Error as e:
        print("Database connection error:", e)
        return None


def initialize_tables():
    """
    Create all required tables if they do not already exist.
    """

    connection = get_db_connection()

    if connection is None:
        print("Could not connect to MySQL.")
        return

    cursor = connection.cursor()

    try:

        # -----------------------------------------
        # USERS TABLE
        # -----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # -----------------------------------------
        # SAVED JOBS TABLE
        # -----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS saved_jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                job_id VARCHAR(100) NOT NULL,
                job_title VARCHAR(255) NOT NULL,
                company VARCHAR(255),
                location VARCHAR(255),
                salary VARCHAR(255),
                job_url TEXT,
                status ENUM(
                    'Saved',
                    'Applied',
                    'Interview',
                    'Offer',
                    'Rejected'
                ) DEFAULT 'Saved',
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                UNIQUE KEY unique_user_job (user_id, job_id),

                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
            )
        """)

        # -----------------------------------------
        # SEARCH HISTORY TABLE
        # -----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS search_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                query VARCHAR(255),
                location VARCHAR(255),
                searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
            )
        """)

        connection.commit()

        print("Database tables initialized successfully.")

    except Error as e:

        print("Error creating tables:", e)

    finally:

        cursor.close()
        connection.close()