# Use an official Python runtime as a parent image
FROM python:3.6-alpine3.6 

# Update Software repository
RUN apt-get update

# Install other dependances
RUN apt-get install wkhtmltopdf

# Set the working directory to /app
WORKDIR /appGenerator

# Copy the current directory contents into the container at /app
COPY . /appGenerator

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.py when the container launches
CMD ["python", "Api.py"]