Chat-Bot: Chat-GPT4.1

#Initial Prompt
Take the role of an expert web developer.

Create a web page for including two functionalities, #1. Real time Stopwatch and #2. Countdown time.
Generate the code only in one HTML file and also a separated javascript file for the functionalities.

There will be 4 screens, I'm attaching the screen layouts in images for reference.
#1 Use the screen1.jpg image to set the landing screen format on where the user can choose between both functionalities.
#2 Use the Stop-Watch.jpg image to set the screen for the stopwatch functionality.
#3 Use the Countdown-Set.jpg image to set the time to count down, allowing to set Hours, Minutes and Seconds.
#4 Use the Countdown-Execute.jpg image to start end the count down, use the same Stop-Watch screen but with countdown functionality.

The user start at landing page selecting the functionality desired.
If Stopwatch then go to Stopwatch screen and the user can start and stop the clock, also the clock can be cleared to start over.
If Countdown then go to Countdown set screen and the user should be able to set Hours:Minutes:Seconds and once SET button is pressed then go to the countdown execute screen is shown.
The user will be able to navigate between screens with the Back button.

#Second Prompt
Now apply full page format to the elements in order to take advantage of the empty space, also the place the milliseconds below the second digit of the seconds. Also add Stopwatch or Countdown title in the top blue ribbon as per de selected functionality.

#Third Prompt
Format crashed for the stopwatch screen, keep the fortmat as the reference image Stop-Watch.jpg attached and expand the elements full width and heigh using all the white space as in the image. Also remove the "Set Countdown Time" subtitle since it is being duplicated  with the main title.

#Fourth Prompt
Make a little improvement to the display format setting the screen class to the full width of the main-content class. Also the buttons make them bigger according with the full width of the main-content element. For the countdown set time screen place the Set button next to the 9 button and the Clear button next to the 4 button. Also make bigger the icon and Back button. Also make sure the responsive functionality does not over place the elements with the top and bottom ribbons.

#Fifth Prompt
remove the style max-width of the .btn and .timer-display classes. Also in the countdown set time screen arrange in two rows of 6 buttons the buttons. Also make 300pm the font size in the .main-time class.

#Seventh Prompt
Keep the previous order of the buttons at the Countdown set time screen. First row 5, 6, 7, 8, 9 and Set buttons, second row, 0, 1, 2, 3, 4 and Clear buttons.
