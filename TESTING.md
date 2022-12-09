
# Introduction
In the course of testing, the goal was for the app to be able to
meet the requirements set by the assignment.

This application is based on my CS424 Final project which 
takes data from the Chicago Data Portal and also utilzes
Geojson data from a repository.

This application creates visualizations to view COVID data for ZIP Codes
in the City of Chicago.

## Testing Methods
I asked my family members to check if the are able to go and acess the link and have it work.
They were able to access the application just fine.

I asked them to see if they can install it on their mobile devices.
They were able to do so. However, there were some issues that I failed to account 
for regarding mobile devices which led to some UI elements being hard to access unless they
tilt their device.

Unfornately, my family did say that that the voice synthesis is not working on the mobile application which was expected.

However, core functionality for visualizations remained. I did not have enough time to go and modify the code so that it can account for differences in the mobile apps.

The application can operate offline due to cached info. Internet was disconnected on the PC
and the application still worked.

The Dev tools were utilized to check the status of IndexDB and the Cache and they included the elements as expected.

IndexDB was used to hold the date and display it on the start screen. This still worked on mobile, however, the date does not update eachtime you open the application.


