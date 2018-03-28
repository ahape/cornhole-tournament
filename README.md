# Test - DatePicker (Range)


### State (S1)

- Page has just loaded
- No user events

### Action S1A1

Clicking into the START input field...

1. Should apply "focus" border around START input.
1. Should place cursor inside of START input.
1. Should open the Date Picker.
1. Should show the current month on the RIGHT calendar.
1. Should have the current day of the current month visually indicated.

### Action S1A2.a.1

Following [Action S1A1](#action-s1a1), Typing `12-12-2018` into the START input field...

1. Should cause the START input text to change to `12/12/2018` (preferred format).
1. Should cause the calendar for 'December 2018' to come into view.
1. Should cause the date '12' to be selected.
1. Should cause the START field to lose its "focus" border.
1. Should apply "focus" border to the END field.
1. Should place cursor inside of END field.

### Action S1A2.a.2

Typing `12-31-2018` into the END input field...

1. Should cause the END input text to change to `12/31/2018`.
1. Should cause the END input field to lose its "focus" border.
1. Should cause the Date Picker to close.

### Action S1A2.b.1

Following [Action S1A1](#action-s1a1), clicking the date for the 15th of the month of the rightmost calendar...

1. Should cause the START input text to change to `{currentMonth}/12/{currentYear}`.
1. Should cause the date '15' to be selected.
1. Should cause the START field to lose its "focus" border.
1. Should apply focus border to the END field.
1. Should place cursor inside of END field.

### Action S1A2.b.2

Rapidly clicking the 'Previous Month' arrow 4 times...

1. Should not highlight the arrow as a user selection.
1. Should present the correct left and right months `currentMonth - 5, currentMonth - 4`.
1. Should maintain the "focus" border around the END input.

### Action S1A2.b.3

Clicking the date for the 15th of the month of the rightmost calendar...

1. Should cause the END input text to change to `{currentMonth-4}/12/{currentYear-?}`.
1. Should cause the END input field to lose its "focus" border.
1. Should cause the START input text to change to be the same as the END input text.
1. Should cause the Date Picker to close.


### State (S2)

- START input has text '12/12/2018'
- END input has text '12/31/2018'
- Both inputs do not have cursor
- Date Picker is closed

