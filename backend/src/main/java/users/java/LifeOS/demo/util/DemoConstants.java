package users.java.LifeOS.demo.util;

import java.util.List;

public final class DemoConstants {

    private DemoConstants() {}

    // =========================================================
    // Authentication
    // =========================================================

    public static final String DEFAULT_PASSWORD = "LifeOS@123";

    public static final String DEMO_EMAIL_DOMAIN = "lifeos.demo";

    // =========================================================
    // Demo Accounts
    // =========================================================

    public static final String ADMIN_USERNAME = "admin";
    public static final String ALICE_USERNAME = "alice";
    public static final String BOB_USERNAME = "bob";
    public static final String CHARLIE_USERNAME = "charlie";

    // =========================================================
    // Roles
    // =========================================================

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    // =========================================================
    // Full Names
    // =========================================================

    public static final List<String> FULL_NAMES = List.of(

            "Aarav Sharma",
            "Vivaan Reddy",
            "Aditya Patel",
            "Arjun Gupta",
            "Rohan Singh",
            "Rahul Kumar",
            "Aryan Verma",
            "Krishna Rao",
            "Akash Joshi",
            "Karan Nair",
            "Priya Mehta",
            "Ananya Kapoor",
            "Aisha Das",
            "Sneha Mishra",
            "Meera Bose",
            "Diya Agarwal",
            "Ishita Yadav",
            "Kavya Chauhan",
            "Pooja Pandey",
            "Neha Kulkarni",
            "Harsh Sharma",
            "Nikhil Gupta",
            "Siddharth Verma",
            "Aman Singh",
            "Tanvi Reddy",
            "Ritika Mehta",
            "Shreya Kapoor",
            "Vaishnavi Rao",
            "Manasa Nair",
            "Anirudh Kumar"

    );

    // =========================================================
    // Colleges
    // =========================================================

    public static final List<WeightedItem<String>> COLLEGES = List.of(

            new WeightedItem<>("TKR College of Engineering and Technology", 30),
            new WeightedItem<>("CBIT", 20),
            new WeightedItem<>("VNR VJIET", 18),
            new WeightedItem<>("MGIT", 12),
            new WeightedItem<>("GRIET", 10),
            new WeightedItem<>("MLRIT", 10)

    );

    // =========================================================
    // Bios
    // =========================================================

    public static final List<String> BIOS = List.of(

            "Backend developer passionate about scalable systems.",
            "Always learning something new.",
            "AI enthusiast exploring machine learning.",
            "Love solving DSA problems.",
            "Building exciting side projects.",
            "Interested in cloud computing.",
            "Coffee. Code. Repeat.",
            "Trying to become a better engineer every day.",
            "Open-source enthusiast.",
            "Exploring distributed systems.",
            "Curious about cybersecurity and networking.",
            "Learning something new every semester.",
            "Focused on placements and interview preparation.",
            "Building projects to sharpen my skills.",
            "Believer in consistency over motivation."

    );
}