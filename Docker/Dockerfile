# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

COPY flask_requirements.txt requirements.txt

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV MAIL_USERNAME=unclothes.service@gmail.com
ENV MAIL_PASSWORD=gymtmeerfhyqgfqc

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

