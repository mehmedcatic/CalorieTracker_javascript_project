# CalorieTracker

This project was designed as a simple calorie tracker app made in JavaScript. 
In the UI design bootrstrap was used along with several jQuery plugins to enhance visual experience:
 - jQuery CounterUp
 - jQuery Confirm modal

*************************************************************************************************************************

The app uses localstorage which mimics database funtions and contains all data associated with the project.
Localstorage stores three types of objects:
 - Items
 - Days
 - DaysMealsArray
 
Days object stores each day added to the app.

Items object stores every meal added to the app.

When a new day is added, it creates a new object of type DaysMealsArray. That particular day is stored in this object along with an empty array which will store items/meals associated with it. 
 
