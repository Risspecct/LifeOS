package users.java.LifeOS.demo.catalog;

import users.java.LifeOS.task.TaskPriority;

import java.util.List;

public final class TaskCatalog {

    private static final List<TaskDefinition> DEFINITIONS = List.of(
            new TaskDefinition(
                    "Complete DBMS Assignment",
                    "Finish the database normalization and SQL query problems.",
                    "Assignment",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Submit AI Lab Report",
                    "Document the experiment results and upload the final lab report.",
                    "Assignment",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Finish Operating Systems Assignment",
                    "Complete scheduling and memory management exercises.",
                    "Assignment",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Prepare Data Structures Worksheet",
                    "Solve the assigned tree and graph problems before class.",
                    "Assignment",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Revise Java Collections",
                    "Review lists, maps, sets, iterators, and common interview examples.",
                    "Study",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Study Computer Networks",
                    "Revise TCP, UDP, routing, and application layer protocols.",
                    "Study",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Practice DSA Problems",
                    "Solve a focused set of array, string, and dynamic programming problems.",
                    "Study",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Review Database Indexing",
                    "Study B-trees, hash indexes, and query optimization examples.",
                    "Study",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Implement JWT Authentication",
                    "Add token validation, login handling, and secure endpoint checks.",
                    "Project",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Complete Backend API",
                    "Finish remaining endpoints and verify request validation.",
                    "Project",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Fix React Dashboard Bugs",
                    "Resolve layout, filtering, and loading state issues in the dashboard.",
                    "Project",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Write Project Documentation",
                    "Prepare setup notes, feature summary, and API usage examples.",
                    "Project",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Update Resume",
                    "Refresh skills, projects, and recent academic achievements.",
                    "Career",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Apply for Internship",
                    "Shortlist openings and submit tailored applications.",
                    "Career",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Practice Interview Questions",
                    "Work through common behavioral and technical interview questions.",
                    "Career",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Update LinkedIn Profile",
                    "Add recent projects, coursework, and a clearer profile summary.",
                    "Career",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Buy Groceries",
                    "Pick up essentials for the week.",
                    "Personal",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Call Parents",
                    "Catch up with family and discuss the week.",
                    "Personal",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Pay Electricity Bill",
                    "Pay the utility bill before the due date.",
                    "Personal",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Organize Study Desk",
                    "Clear notes, sort stationery, and prepare the workspace.",
                    "Personal",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Morning Workout",
                    "Complete a short strength or cardio session.",
                    "Health",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Drink Water",
                    "Track hydration and keep a water bottle nearby.",
                    "Health",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Evening Walk",
                    "Take a walk after study hours to reset.",
                    "Health",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Plan Weekly Meals",
                    "Decide simple meals and snacks for the week.",
                    "Health",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Read IEEE Paper",
                    "Read the selected research paper and note key findings.",
                    "Research",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Review Literature",
                    "Summarize related work and identify useful references.",
                    "Research",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Prepare Presentation",
                    "Create slides and rehearse the main explanation.",
                    "Research",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Analyze Survey Responses",
                    "Review responses and extract useful patterns for the report.",
                    "Research",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Team Meeting",
                    "Discuss current blockers, progress, and next steps.",
                    "Meeting",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Mentor Discussion",
                    "Review project direction and ask for technical feedback.",
                    "Meeting",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Project Review",
                    "Prepare updates and collect feedback from the review session.",
                    "Meeting",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Club Planning Call",
                    "Coordinate agenda, responsibilities, and event timeline.",
                    "Meeting",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Read Clean Code",
                    "Read a chapter and note practices to apply in coursework projects.",
                    "Reading",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Read Design Patterns Chapter",
                    "Study one pattern and write a small example implementation.",
                    "Reading",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Read Technical Blog",
                    "Read a recent engineering article and save useful takeaways.",
                    "Reading",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Review Lecture Notes",
                    "Clean up notes and mark topics that need another pass.",
                    "Study",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Prepare Exam Formula Sheet",
                    "Collect important formulas, definitions, and examples.",
                    "Study",
                    TaskPriority.HIGH
            ),
            new TaskDefinition(
                    "Create Revision Timetable",
                    "Plan study blocks for upcoming quizzes and exams.",
                    "Study",
                    TaskPriority.MEDIUM
            ),
            new TaskDefinition(
                    "Check Scholarship Portal",
                    "Review application status and upcoming document requirements.",
                    "Career",
                    TaskPriority.LOW
            ),
            new TaskDefinition(
                    "Submit Course Feedback",
                    "Complete feedback forms for current semester courses.",
                    "Personal",
                    TaskPriority.LOW
            )
    );

    private TaskCatalog() {
    }

    public static List<TaskDefinition> definitions() {
        return DEFINITIONS;
    }
}
