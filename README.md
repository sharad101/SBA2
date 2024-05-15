Learner Data Analysis

Description

This application processes learner submissions for assignments in a given course and computes the weighted average scores for each learner.
The application validates the input data, ensures that assignments belong to the correct course, and handles potential errors gracefully. 
The final output is an array of objects, each representing a learner's performance in the specified format.

Features

-Course and Assignment Validation: Ensures that assignments belong to the specified course.

-Weighted Average Calculation: Computes the weighted average scores for each learner, considering the points possible for each assignment.

-Late Submission Penalty: Deducts 10% of the total points possible if a submission is late.

-Excludes Not Yet Due Assignments: Assignments that are not yet due are excluded from the results.

-Error Handling: Handles various potential errors such as invalid dates, zero points possible, and data type mismatches.
