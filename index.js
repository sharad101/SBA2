const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function validateData(course, ag) {
  if (ag.course_id !== course.id) {
    throw new Error("Assignment group does not belong to the provided course.");
  }
}

function getWeightedAverage(submissions, assignments) {
  let totalScore = 0;
  let totalPossible = 0;
  
  submissions.forEach(submission => {
    const assignment = assignments.find(a => a.id === submission.assignment_id);
    if (!assignment) {
      throw new Error(`Assignment with ID ${submission.assignment_id} not found.`);
    }
    
    const dueDate = new Date(assignment.due_at);
    const submissionDate = new Date(submission.submitted_at);
    
    if (isNaN(dueDate) || isNaN(submissionDate)) {
      throw new Error(`Invalid date format for assignment ID ${assignment.id} or submission.`);
    }

    if (dueDate > new Date()) {
      return; // Skip if assignment is not yet due
    }
    
    if (assignment.points_possible === 0) {
      throw new Error(`Points possible for assignment ID ${assignment.id} is zero.`);
    }
    
    let score = submission.score;
    if (submissionDate > dueDate) {
      score = Math.max(0, score - assignment.points_possible * 0.1); // Deduct 10% for late submission
    }
    
    totalScore += score;
    totalPossible += assignment.points_possible;
  });

  return totalPossible === 0 ? 0 : totalScore / totalPossible;
}

function getLearnerData(course, ag, submissions) {
  try {
    validateData(course, ag);
  } catch (error) {
    console.error(error.message);
    return [];
  }
  
  const learners = [...new Set(submissions.map(sub => sub.learner_id))];
  const results = [];

  learners.forEach(learnerId => {
    const learnerSubmissions = submissions.filter(sub => sub.learner_id === learnerId);
    const learnerData = {
      id: learnerId,
      avg: 0
    };

    ag.assignments.forEach(assignment => {
      const submission = learnerSubmissions.find(sub => sub.assignment_id === assignment.id);
      if (!submission) return;

      const dueDate = new Date(assignment.due_at);
      if (dueDate > new Date()) {
        return; // Skip if assignment is not yet due
      }

      let score = submission.submission.score;
      const submissionDate = new Date(submission.submission.submitted_at);
      if (submissionDate > dueDate) {
        score = Math.max(0, score - assignment.points_possible * 0.1); // Deduct 10% for late submission
      }

      if (assignment.points_possible !== 0) {
        learnerData[assignment.id] = score / assignment.points_possible;
      } else {
        console.error(`Assignment ID ${assignment.id} has points_possible as 0, skipping.`);
      }
    });

    learnerData.avg = getWeightedAverage(learnerSubmissions, ag.assignments);
    results.push(learnerData);
  });

  return results;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
