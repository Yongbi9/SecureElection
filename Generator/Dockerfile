# Use an official Python runtime as a parent image
FROM ubuntu:18.04

# Update Software repository
RUN apt-get update

# Install other dependances
RUN apt-get install python3 -y
RUN apt-get install python3-pip -y
RUN apt-get install xvfb -y
RUN apt-get install wkhtmltopdf -y
RUN pip3 install imgkit -y
RUN pip3 install jinja2 -y
RUN pip3 install requests -y
RUN pip3 install Flask -y
RUN pip3 install flask-restful -y


# Set the working directory to /app
WORKDIR /app_generator

# Copy the current directory contents into the container at /app
COPY . /app_generator

# Install any needed packages specified in requirements.txt
RUN pip3 install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.py when the container launches
CMD ["python3", "Api.py"]