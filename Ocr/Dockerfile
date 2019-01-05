# Use an official Python runtime as a parent image
FROM ubuntu:18.04

# Update Software repository
RUN apt-get update

# install other dependances
RUN apt-get install python3 -y
RUN apt-get install python3-pip -y
RUN apt-get install ttf-aenigma fonts-tuffy -y
RUN apt-get install tesseract-ocr -y
RUN pip3 install pytesseract 
RUN pip3 install requests
RUN pip3 install Flask
RUN pip3 install flask-restful 


# Set the working directory to /app
WORKDIR /app_ocr

# Copy the current directory contents into the container at /app
COPY . /app_ocr

# Install any needed packages specified in requirements.txt
RUN pip3 install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.py when the container launches
CMD ["python3", "Api.py"]