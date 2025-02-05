# Mobile application for events

## Created with Expo [`create-expo-app`](https://www.npmjs.com/package/create-expo-app)

## Tech stack

React native, Expo, JavaScript

## Cloudstack

Firebase, Google Cloud, Cloudinary

# Description

This is a mobile application, that allows it's users to see events, that have been posted. <br>
Users can create accounts and with them, they can take participants in the events and also create one. <br>
The application support authorization with valid Google account. <br>
If user has logged in with Google account, there is a automatic synchronization with Google Calendar when the user purchase ticket. This is followed with alarm when the event start date come. <br>

## Database

The project uses cloud based database. It's name is Firebase Database. It is a NoSQL, document-based database. In the project there are two collections:

1. Users - stores data for every user that has created or used Google account
2. Events - stores data about the events, such as event name, location, start and end date and price ticket

## Storage

When user creates event he can select images from his phone. This images idea is to describe the event or give more information about it. Images are stored in Cloudinary cloud service. First they are uploaded and then their url is saved in array field named images that every event document has in the database.
