# data_chunks.py

'''chunks = [
    {
        "id": "cs_four_year_plan_overview",
        "text": (
            "The Bachelor of Science in Computer Science at Georgia State University "
            "requires a total of 120 credit hours. The program provides students with "
            "a strong foundation in mathematics, science, and computer science, "
            "preparing them for careers in technology and research or for graduate study. "
            "Students follow a structured four-year plan of study that includes core curriculum, "
            "major requirements, and electives."
        ),
        "metadata": {
            "source": "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
            "topic": "CS degree requirements"
        }
    },
    {
        "id": "cs_four_year_plan_first_year",
        "text": (
            "In the first year, students complete English Composition I and II, Precalculus, "
            "and Calculus I. They also begin computer science coursework with CSC 1301 "
            "(Principles of Computer Science I) and CSC 1302 (Principles of Computer Science II). "
            "Additional requirements include U.S. History, Social Science electives, "
            "KINE 1000 Lifetime Fitness, and GSU 1010 New Student Orientation. "
            "By the end of the first year, students will have completed approximately 30 credit hours."
        ),
        "metadata": {
            "source": "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
            "topic": "CS degree requirements"
        }
    },
    {
        "id": "cs_four_year_plan_second_year",
        "text": (
            "In the second year, students progress to Calculus II and III, Data Structures (CSC 2720), "
            "and Theoretical Foundations of Computer Science (CSC 2510). They also complete "
            "two lab science courses and additional Social Science electives. "
            "KINE 2000 Health and Wellness is also part of the second-year plan. "
            "By the end of the sophomore year, students should have completed around 61 credit hours."
        ),
        "metadata": {
            "source": "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
            "topic": "CS degree requirements"
        }
    },
    {
        "id": "cs_four_year_plan_third_year",
        "text": (
            "In the third year, students take System-Level Programming (CSC 3320), "
            "Computer Organization and Programming (CSC 3210), and Algorithms (CSC 4330). "
            "They also complete lab sciences, a humanities elective, Database Systems (CSC 4520), "
            "Programming Languages (CSC 4320), and Software Engineering (CSC 4222). "
            "This year emphasizes core computer science and upper-division coursework."
        ),
        "metadata": {
            "source": "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
            "topic": "CS degree requirements"
        }
    },
    {
        "id": "cs_four_year_plan_fourth_year",
        "text": (
            "In the fourth year, students complete the Senior Capstone Project sequence (CSC 4980 and CSC 4981), "
            "along with multiple computer science electives. Major electives, free electives, "
            "and additional humanities or fine arts courses round out the degree. "
            "This final year allows students to specialize in areas of interest while demonstrating "
            "their skills in a capstone project. By graduation, students will have completed 120 credit hours."
        ),
        "metadata": {
            "source": "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
            "topic": "CS degree requirements"
        }
    }
]


cs_degree_requirements_chunk = {
    "id": "cs_degree_req_1",
    "text": (
        "The Bachelor of Science in Computer Science at Georgia State University "
        "requires students to complete a four-year plan of study that includes "
        "a mix of computer science, mathematics, natural science, and general "
        "education courses. In the first year, students typically take "
        "introductory programming, calculus, and core curriculum classes such "
        "as English Composition and social sciences. The second year continues "
        "with courses like Data Structures, Discrete Mathematics, and additional "
        "laboratory science requirements. In the third year, students progress "
        "to advanced topics including Software Engineering, Database Systems, "
        "and Computer Organization, alongside electives. The fourth year focuses "
        "on upper-level electives in areas such as Artificial Intelligence, "
        "Networking, and Operating Systems, along with the Senior Project or "
        "Capstone course. A minimum of 120 credit hours is required for graduation, "
        "and students must follow prerequisites carefully to stay on track."
    ),
    "metadata": {
        "source": "GSU Computer Science Department Website",
        "topic": "CS degree requirements"
    }
}



chunks.extend([
    {
        "id": "cs_program_overview",
        "text": (
            "Computer science is the systematic exploration of all aspects of computation, "
            "including computer design, programming and software, information processing, "
            "algorithmic solutions, and the algorithmic process itself. It provides "
            "foundations for applications in industry, science, government, and business, "
            "preparing the basis for tomorrow's computing, medical advances, and instant "
            "access to information. The Georgia State University B.S. degree program "
            "prepares students for careers in industry, science, government, and business, "
            "as well as for graduate studies (M.S. or Ph.D.)."
        ),
        "metadata": {
            "source": "https://catalogs.gsu.edu/preview_program.php?catoid=42&poid=12378&utm_source=program-list&utm_campaign=catalog",
            "topic": "CS degree overview"
        }
    },
    {
        "id": "cs_contact_admissions",
        "text": (
            "Contact: Xiaolin Hu (cscundergrad@gsu.edu, 404-413-5700). "
            "Admissions deadlines: Spring - Early: Oct 1, Regular: Dec 1; "
            "Summer - Early: Feb 1, Regular: May 1; Fall - Opens Aug 1, Honors/Scholarship Priority: Nov 15, Notification: Dec 15, Regular: May 1. "
            "Test scores are optional for students with GPA ≥ 3.4 until Summer 2026; otherwise, submit test scores."
        ),
        "metadata": {
            "source": "https://catalogs.gsu.edu/preview_program.php?catoid=42&poid=12378&utm_source=program-list&utm_campaign=catalog",
            "topic": "CS admissions info"
        }
    },
    {
        "id": "cs_academic_regulations",
        "text": (
            "The B.S. program provides preparation in fundamental computation principles "
            "and trains students to apply these principles in areas like industry, science, "
            "government, and business. Core curriculum requires two calculus courses (MATH 2211 and 2212). "
            "Prerequisites and co-requisites are strictly enforced. Students must maintain "
            "an institutional GPA of 2.0 and a major GPA of 2.0 to graduate. Grades of C- may satisfy graduation, "
            "but some courses require C or higher."
        ),
        "metadata": {
            "source": "https://catalogs.gsu.edu/preview_program.php?catoid=42&poid=12378&utm_source=program-list&utm_campaign=catalog",
            "topic": "CS academic regulations"
        }
    },
    {
        "id": "cs_major_eligibility",
        "text": (
            "To enroll in major-level CSC courses (CSC 2720 and all 3000-4000 level courses), students must: "
            "1) Complete CSC 1301/1301L, CSC 2510 or MATH 2420, and MATH 1113/2211/2212/2215 with C or higher; "
            "2) Achieve 2.5 GPA across these courses. Transfer students may count transferred grades. "
            "Pre-Computer Science students have not yet met these requirements."
        ),
        "metadata": {
            "source": "https://catalogs.gsu.edu/preview_program.php?catoid=42&poid=12378&utm_source=program-list&utm_campaign=catalog",
            "topic": "CS major eligibility"
        }
    },
    {
        "id": "cs_degree_requirements_core_field",
        "text": (
            "Core IMPACTS and Field of Study: Mathematics & Quantitative Skills - MATH 1113 recommended; "
            "Technology, Mathematics & Sciences - MATH 2211 recommended. Field of Study requires 18 hours, "
            "including MATH 2212 (Calculus II) and electives. Ethics requirement: CSC 2920 or PHIL 2920. "
            "Additional courses include DSCI, ECON, GEOL, PHYS, PHIL, SCOM, and world language electives."
        ),
        "metadata": {
            "source": "https://catalogs.gsu.edu/preview_program.php?catoid=42&poid=12378&utm_source=program-list&utm_campaign=catalog",
            "topic": "CS core and field of study"
        }
    },
    {
        "id": "cs_major_courses",
        "text": (
            "Major Area (48 hours): MATH 2641 Linear Algebra I, MATH 3020 Applied Probability and Statistics, "
            "CTW: CSC 3350 Software Development-CTW. CSC Requirements (22 hrs): CSC 2720 Data Structures, "
            "CSC 3210 Computer Organization, CSC 3320 System-Level Programming, CSC 4320/4330 Operating Systems or Programming Languages, "
            "Capstone: CSC 4350/4351/4352 or Software Engineering-CTW, CSC 4520 Design & Analysis of Algorithms, "
            "Plus at least four CSC electives at 3000-4000 level."
        ),
        "metadata": {
            "source": "https://catalogs.gsu.edu/preview_program.php?catoid=42&poid=12378&utm_source=program-list&utm_campaign=catalog",
            "topic": "CS major courses"
        }
    },
    {
        "id": "cs_additional_opportunities",
        "text": (
            "Additional Courses Area (12 hrs): 2000-4000 level electives to complete 120 credit hours. "
            "Opportunities: Certificate in Cyber Security, Certificate in Data Science, Cooperative Education & Internships, "
            "Graduation with Distinction in the Major. Students can rotate between full-time study and professional positions, "
            "and consult the undergraduate director for distinction criteria."
        ),
        "metadata": {
            "source": "https://catalogs.gsu.edu/preview_program.php?catoid=42&poid=12378&utm_source=program-list&utm_campaign=catalog",
            "topic": "CS additional opportunities"
        }
    }
])

chunks_structured = [
    # --- Computer Science Courses ---
    {"id": "cs_course_1010", "text": "CSC 1010 - Computers and Applications", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_1301", "text": "CSC 1301 - Principles of Computer Science I", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_1302", "text": "CSC 1302 - Principles of Computer Science II", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_2510", "text": "CSC 2510 - Theoretical Foundations of Computer Science", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_2720", "text": "CSC 2720 - Data Structures", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_2920", "text": "CSC 2920 - Ethical and Social Issues in Computing", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_3210", "text": "CSC 3210 - Computer Organization and Programming", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_3320", "text": "CSC 3320 - System-Level Programming", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_3350", "text": "CSC 3350 - Software Development-CTW", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_3900", "text": "CSC 3900 - Technical Interview Preparation I", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4110", "text": "CSC 4110 - Introduction to Embedded Systems Laboratory", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4120", "text": "CSC 4120 - Introduction to Robotics", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4210", "text": "CSC 4210 - Computer Architecture", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4220", "text": "CSC 4220 - Computer Networks", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4221", "text": "CSC 4221 - Mobile Computing and Wireless Network Security", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4222", "text": "CSC 4222 - Fundamentals of Cybersecurity", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4223", "text": "CSC 4223 - Privacy", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4224", "text": "CSC 4224 - Ethical Hacking", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4226", "text": "CSC 4226 - Secure Software Engineering", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4227", "text": "CSC 4227 - Network Security", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4250", "text": "CSC 4250 - Malware Analysis and Defense", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4251", "text": "CSC 4251 - Computer Forensics", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4260", "text": "CSC 4260 - Digital Image Processing", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4310", "text": "CSC 4310 - Parallel and Distributed Computing", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4311", "text": "CSC 4311 - Cloud Computing", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4320", "text": "CSC 4320 - Operating Systems", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4330", "text": "CSC 4330 - Programming Language Concepts", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4340", "text": "CSC 4340 - Compilers", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4350", "text": "CSC 4350 - Software Engineering - CTW", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4351", "text": "CSC 4351 - Capstone Senior Design I-CTW", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4352", "text": "CSC 4352 - Capstone Senior Design II-CTW", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4360", "text": "CSC 4360 - Mobile Application Development", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4370", "text": "CSC 4370 - Web Programming", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4510", "text": "CSC 4510 - Automata", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4520", "text": "CSC 4520 - Design and Analysis of Algorithms", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4610", "text": "CSC 4610 - Numerical Analysis I", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4620", "text": "CSC 4620 - Numerical Analysis II", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4630", "text": "CSC 4630 - Matlab", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4650", "text": "CSC 4650 - Introduction to Bioinformatics", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4710", "text": "CSC 4710 - Database Systems", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4720", "text": "CSC 4720 - Human-Computer Interaction", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4730", "text": "CSC 4730 - Data Visualization", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4740", "text": "CSC 4740 - Data Mining", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4750", "text": "CSC 4750 - Semantic Web", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4760", "text": "CSC 4760 - Big Data Programming", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4780", "text": "CSC 4780 - Fundamentals of Data Science", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4810", "text": "CSC 4810 - Artificial Intelligence", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4820", "text": "CSC 4820 - Interactive Computer Graphics", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4821", "text": "CSC 4821 - Fundamentals of Game Design", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4840", "text": "CSC 4840 - Advanced Computer Graphics Programming", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4841", "text": "CSC 4841 - Computer Animation", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4850", "text": "CSC 4850 - Machine Learning", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4851", "text": "CSC 4851 - Introduction to Deep Learning", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4870", "text": "CSC 4870 - Honors Thesis I", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4880", "text": "CSC 4880 - Honors Thesis II", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4900", "text": "CSC 4900 - Technical Interview Preparation II", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4940", "text": "CSC 4940 - Computer Science Internship", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4980", "text": "CSC 4980 - Topics in Computer Science", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4982", "text": "CSC 4982 - Undergraduate Research in Computer Science", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4995", "text": "CSC 4995 - Directed Readings BIS-CTW", "metadata": {"source": "GSU CS Course Catalog", "topic": "Computer Science Courses"}},
    {"id": "cs_course_4998", "text": "CSC 4998 - Selected Topics", "metadata": {"source": "GSU CS Course Catalog"}}
]


chunks_structured.extend([
    # --- Data Science Courses ---
    {"id": "ds_course_1501", "text": "DATA 1501 - Introduction to Data Science", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4311", "text": "DSCI 4311 - Cloud Computing", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4351", "text": "DSCI 4351 - Capstone Senior Design I-CTW", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4352", "text": "DSCI 4352 - Capstone Senior Design II-CTW", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4370", "text": "DSCI 4370 - Web Programming", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4710", "text": "DSCI 4710 - Database Systems", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4730", "text": "DSCI 4730 - Data Visualization", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4740", "text": "DSCI 4740 - Data Mining", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4750", "text": "DSCI 4750 - Semantic Web", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4760", "text": "DSCI 4760 - Big Data Programming", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4780", "text": "DSCI 4780 - Fundamentals of Data Science", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4810", "text": "DSCI 4810 - Artificial Intelligence", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4850", "text": "DSCI 4850 - Machine Learning", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4851", "text": "DSCI 4851 - Deep Learning", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},
    {"id": "ds_course_4940", "text": "DSCI 4940 - Data Science Internship", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Courses"}},

    # --- Certificates ---
    {"id": "cert_ds_1", "text": "Certificate in Data Science - With the proliferation of social networks and mobile computing, along with emerging areas such as the Internet of Things and cyber sensing and networking technologies, generating and collecting data has become ubiquitous. The collection and analysis of such large amounts of data have become increasingly important for today’s global and competitive economy.", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Certificate"}},
    {"id": "cert_ds_2", "text": "Businesses and industries are striving to use data analytics, data mining, machine learning and statistical models to make better data-driven decisions. As a result, there is a significant and growing demand for scientists trained in managing large data sets, developing and utilizing computer systems/software to process data, extracting knowledge or insights from data in various forms and modeling predictive analytics.", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Certificate"}},
    {"id": "cert_ds_3", "text": "The certificate in data science consists of 16 credit hours at the 4000 level from a restricted set of courses with an earned grade of B or higher in the first attempt at each course. Normally, students are declared as computer science majors to meet the requirements of this certificate. See the course catalog for more details.", "metadata": {"source": "GSU Data Science Catalog", "topic": "Data Science Certificate"}},

    {"id": "cert_cyber_1", "text": "Certificate in Cybersecurity - Along with emerging technologies such as the Internet of Things and cloud computing come cyber threats. There is a growing need for professionals who are skilled at keeping digital information and infrastructure safe.", "metadata": {"source": "GSU Data Science Catalog", "topic": "Cybersecurity Certificate"}},
    {"id": "cert_cyber_2", "text": "The certificate in cybersecurity is designed to develop expertise in network security, information security and cyber-crime in order to prevent and respond to large-scale cyber threats and attacks. The certificate allows students to offer tangible proof of their technical and strategic knowledge in cybersecurity.", "metadata": {"source": "GSU Data Science Catalog", "topic": "Cybersecurity Certificate"}},
    {"id": "cert_cyber_3", "text": "The certificate in cybersecurity consists of 16 credit hours at the 4000 level from a restricted set of courses, with an earned grade of B or higher in the first attempt at each course. Normally, students are declared as computer science majors to meet the requirements of this certificate. See the course catalog for more details.", "metadata": {"source": "GSU Data Science Catalog", "topic": "Cybersecurity Certificate"}}
])

# --- CORRECTED Dual Degree Overview ---
# The following strings have been converted to the proper dictionary format.
chunks.extend([
    {
        "id": "dual_degree_overview_1",
        "text": "The department offers a dual Bachelor of Science and Master of Science in Computer Science. The dual degree opportunity enables qualified students to enroll in graduate courses late in their undergraduate program and apply the coursework toward both the bachelor’s and master’s programs.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Overview"}
    },
    {
        "id": "dual_degree_overview_2",
        "text": "Students must be formally accepted into the dual degree program by the participating departments and colleges to be able to take graduate courses as an undergraduate. Additionally, acceptance into the dual program does not constitute admission to the master’s program. Students must fulfill regular graduate admissions requirements and apply for the master’s program following college processes.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Overview"}
    },
    {
        "id": "dual_degree_overview_3",
        "text": "Information about the dual program, including application instructions and program requirements, can be found at cas.gsu.edu/dual-degrees/.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Overview"}
    }
])

# --- Application Requirements ---
chunks_structured.extend([
    # --- Dual Degree Application Requirements ---
    {
        "id": "dual_app_req_1",
        "text": "CSC Dual Degree Application Requirements: CSC Majors must have successfully completed the following courses with a B or better prior to applying:",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Application"}
    },
    {
        "id": "dual_app_req_2",
        "text": "CSC 1301 - Principles of Computer Science I & CSC 1301 - Principles of Computer Science Laboratory I, CSC 1302 - Principles of Computer Science II & CSC 1302 - Principles of Computer Science Laboratory II, CSC 2720 - Data Structures, and either CSC 2510 - Theoretical Foundations of Computer Science or MATH 2420 - Discrete Mathematics.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Application"}
    },
    {
        "id": "dual_app_req_3",
        "text": "Applicants must have a 3.5 or better overall GPA.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Application"}
    },

    # --- Dual Degree Course Requirements ---
    {
        "id": "dual_course_req_1",
        "text": "CSC Dual Degree Course Requirements: Computer Science Dual Degree Students can earn graduate credit by completing the following courses with a grade of B or better:",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Course Requirements"}
    },
    {
        "id": "dual_course_req_2",
        "text": "CSC 8900 - Seminar in Computer Science - 1 credit hour (required), 2 CSC 6000-level courses - 8 credit hours, and 1 CSC 8000-level course - 4 credit hours.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Course Requirements"}
    },
    {
        "id": "dual_course_req_3",
        "text": "The 8 credit hours of the two CSC 6000-level courses can be counted either in the Major Area as CSC Elective Courses or in the Additional Courses Area. The 1 credit CSC 8900 can only be counted in the Additional Courses Area. No more than 9 graduate course credits or 3 graduate courses taken as an undergraduate student will be used at either the undergraduate or graduate level, depending on the program’s requirements.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Course Requirements"}
    },
    {
        "id": "dual_course_req_4",
        "text": "Possible course plans specific to preferred areas of study are available by request by emailing CASDualDegree@gsu.edu or by visiting https://cas.gsu.edu/academics-admissions/undergraduate-learning/dual-degree-programs-overview/dual-degree-program-list/.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Dual Degree Course Requirements"}
    },

    # --- Incoming Students ---
    {
        "id": "dual_incoming_1",
        "text": "Incoming Students: Incoming bachelor’s students will apply through Undergraduate Admissions. After acceptance to Georgia State, students interested in a dual-degree program should discuss eligibility requirements with the dual-degree program coordinator at the start of their sophomore year.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Incoming Students"}
    },
    {
        "id": "dual_incoming_2",
        "text": "High school seniors or recent graduates (within the last two years) apply using Georgia State’s Common Application.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Incoming Students"}
    },
    {
        "id": "dual_incoming_3",
        "text": "International Students: Applicants include those in the U.S. on non-immigrant visas (B-1, H-1, J-1, etc.), students abroad who will need an F-1 visa, or those awaiting permanent residency. Learn more about the international application process.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Incoming Students"}
    },
    {
        "id": "dual_incoming_4",
        "text": "Transfer Students: Students already in college may transfer to Georgia State to pursue the dual degree. Learn more about transferring to Georgia State.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Incoming Students"}
    }
])

chunks_structured.extend([
    # --- Eligibility ---
    {
        "id": "dual_eligibility_1",
        "text": "Dual-Degree Program Eligibility: The Dual B.S./M.S. Program in Computer Science is available to undergraduate computer science majors with a minimum cumulative GPA of 3.5. Students may apply after completing 30-80 credit hours.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Eligibility"}
    },
    {
        "id": "dual_eligibility_2",
        "text": "Email CASDualDegree@gsu.edu to discuss eligibility. If eligible, students receive an electronic application form, and decisions are typically emailed within 10 business days.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Eligibility"}
    },
    {
        "id": "dual_eligibility_3",
        "text": "Students accepted into dual undergraduate/graduate programs must work with the program’s graduate director each term to plan graduate courses during their senior year while completing their bachelor’s degree.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Eligibility"}
    },
    {
        "id": "dual_eligibility_4",
        "text": "Admission to the graduate program occurs in the senior year and requires completion of the bachelor’s degree, maintenance of GPA, satisfactory performance in graduate-level courses, and fulfillment of all graduate program requirements.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Eligibility"}
    },

    # --- Additional Requirements ---
    {
        "id": "dual_additional_1",
        "text": "Additional requirements to qualify for the dual degree in computer science include:",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Additional Requirements"}
    },
    {
        "id": "dual_additional_2",
        "text": "A grade of B or better in CSC 1301, CSC 1302, CSC 2720, and either CSC 2510 or Math 2420.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Additional Requirements"}
    },
    {
        "id": "dual_additional_3",
        "text": "A cumulative GPA of 3.5 or higher across the above courses.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Additional Requirements"}
    },
    {
        "id": "dual_additional_4",
        "text": "Completion of no more than 4 credit hours in Area H.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Additional Requirements"}
    },

    # --- Careers ---
    {
        "id": "dual_careers_1",
        "text": "Careers: Students who earn an M.S. in Computer Science work in companies such as Google, eBay, GE, Amazon, Anthem, UPS, Coca-Cola, LexisNexis, ADP, and NCR. Most graduates are employed within a few months of graduation; others continue to Ph.D. programs.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Careers"}
    },

    # --- Graduate Course Registration Process ---
    {
        "id": "dual_grad_registration_1",
        "text": "How to Register for Graduate Courses for Dual-Degree Program Students:",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Graduate Course Registration"}
    },
    {
        "id": "dual_grad_registration_2",
        "text": "1. Meet with your academic advisor to discuss graduation plans and review remaining degree requirements. Information about scheduling an appointment is available online.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Graduate Course Registration"}
    },
    {
        "id": "dual_grad_registration_3",
        "text": "2. Meet with your dual degree faculty coordinator (or designee) to discuss progression and graduate course enrollment options. View available course offerings on the GSU website.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Graduate Course Registration"}
    },
    {
        "id": "dual_grad_registration_4",
        "text": "3. If you plan to take a graduate course in the next term, fill out the Graduate Course Approval Form and email it to CASDualDegree@gsu.edu.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Graduate Course Registration"}
    },
    {
        "id": "dual_grad_registration_5",
        "text": "4. Register for the graduate course once you receive authorization. Review your academic evaluation to confirm where the course counts. If unclear, email CASDualDegree@gsu.edu with questions.",
        "metadata": {"source": "GSU Computer Science Dual Degree Catalog", "topic": "Graduate Course Registration"}
    }
])


chunks_structured.extend([
    {
        "id": "ds_chunk_1",
        "text": "The B.S. program in Data Science provides students with a strong foundation in mathematics, computer programming, algorithmic skills, and core Data Science methodologies. Students gain experience in ethical standards related to data science, and finish with a capstone project applying all learned concepts. Graduates are prepared for careers in industry, government, or research, or for graduate study in Data Science, Computer Science, or Computer Engineering.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Program Overview"}
    },
    {
        "id": "ds_chunk_2",
        "text": "Students begin with courses in mathematics and programming before progressing to Data Science core courses, including Fundamentals of Data Science, Machine Learning, Data Mining, Database Systems, and Ethics for Data Science. They also complete 15 credits of electives and a Capstone course demonstrating applied data science skills.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Academic Structure"}
    },
    {
        "id": "ds_chunk_3",
        "text": "Students must take MATH 2211 and MATH 2212 as part of the core curriculum, with the extra 'rollover hour' counted in the Field of Study Area. Students must maintain at least a 2.0 institutional GPA and a 2.0 major GPA. Some prerequisites require a grade of C or higher.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Academic Regulations"}
    },
    {
        "id": "ds_chunk_4",
        "text": "To enroll in major-level Data Science (DSCI) courses, students must earn at least a 2.5 GPA across key preparatory courses with no grade below C on the first attempt. These include CSC 1301, CSC 2510 or MATH 2420, and one of MATH 1113, 2211, 2212, or 2215. WF counts as an attempt, Ws do not, and AP credit does not count toward this GPA.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Major Eligibility Requirements"}
    },
    {
        "id": "ds_chunk_5",
        "text": "The B.S. in Data Science requires 120 total credit hours. This includes the Core IMPACTS areas, Field of Study (18 hours), Major Area (48 hours), and 12 hours of additional electives. Students can also use electives to pursue minors or focused domains.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Degree Requirements Overview"}
    },
    {
        "id": "ds_chunk_6",
        "text": "Required courses include CSC 1301/1302 with labs, CSC 2510, and MATH 2212. Field electives include options like Accounting, Biology, Chemistry, Economics, Ethics, Communication, and World Languages. CSC 2920 and PHIL 2920 may also be taken to fulfill ethics components.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Field of Study Courses"}
    },
    {
        "id": "ds_chunk_7",
        "text": "Preparatory courses include CSC 2720, CSC 4520, MATH 2641, and MATH 3020. Core Data Science courses include DSCI 4351, 4352, 4710, 4740, 4780, and 4850. Electives include advanced computing and mathematics topics like Cloud Computing, Big Data, Deep Learning, Optimization, and Statistical Methods.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Major Area Courses"}
    },
    {
        "id": "ds_chunk_8",
        "text": "Students complete 12 hours of additional courses (1000–4000 level) to tailor their studies or pursue a minor. Students with exceptional performance may graduate with distinction in the major; details are available from the undergraduate director.",
        "metadata": {"source": "GSU Data Science Program", "topic": "Additional Courses and Distinction"}
    }
])

career_services_chunks = [
    {
        "id": "career_services_1",
        "text": (
            "The University Career Services co-op and internship team assists students of all majors "
            "and class levels with resources to learn more about an industry, field, or specific job or position. "
            "The team partners with industry leaders in government, non-profits, and Fortune 500 companies "
            "to assist students in their college-to-career journey."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "Career Services Overview"
        }
    },
    {
        "id": "career_services_2",
        "text": (
            "Internships and co-ops offer students and recent graduates the opportunity to participate in "
            "short-term projects in a professional work environment. Students learn by experience alongside "
            "real professionals, applying school-learned skills in a professional setting and expanding their network."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "Purpose of Internships/Co-ops"
        }
    },
    {
        "id": "career_services_3",
        "text": (
            "Having a co-op or internship can help students gain valuable experience, figure out their career path, "
            "apply skills learned in school, expand their professional network, and be considered for full-time positions. "
            "Microinternships, part-time/full-time internships, and rotational experiences such as co-ops are available "
            "in-person, remotely, or hybrid, locally, nationally, and abroad."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "Benefits of Experiential Learning"
        }
    },
    {
        "id": "career_services_4",
        "text": (
            "Types of experiential learning experiences include: "
            "Microinternships (year-round, all levels, 10-40 hours total), "
            "Full-time internships (summer, all levels, 40 hours/week), "
            "Part-time internships (fall/spring, all levels, less than 35 hours/week), "
            "Rotational experiences (co-ops, year-round, 2nd-4th year, varies), "
            "and Intern abroad (varies by program)."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "Types of Experiential Learning"
        }
    },
    {
        "id": "career_services_5",
        "text": (
            "Students can access Handshake to view a wide array of internship and co-op opportunities "
            "offered remotely, in person, or hybrid locally and nationally. "
            "In partnership with the Study Abroad Office, students can also explore international internships "
            "to gain practical experience related to their studies or career goals abroad while earning academic credit."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "Internship Platforms & International Opportunities"
        }
    },
    {
        "id": "career_services_6",
        "text": (
            "University Career Services provides guidance on co-op and internship questions such as: "
            "how to find a co-op or internship, how to get credit, the difference between co-ops and internships, "
            "and when to pursue these experiences. Students should contact their department for credit requirements."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "FAQ Guidance"
        }
    },
    {
        "id": "career_services_7",
        "text": (
            "University Career Services Main Office is located at 25 Park Place NE, Suite 111, Atlanta, GA 30303. "
            "Office hours are Monday-Friday, 8:30 a.m. – 5:15 p.m. Professional headshots and career counseling appointments "
            "are available both in-person and virtually. Appointments can be scheduled through Handshake."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "Office Information"
        }
    },
    {
        "id": "career_services_8",
        "text": (
            "Career Closet locations are available on Atlanta, Clarkston, and Dunwoody campuses, "
            "and students can also shop online 24/7 at gsucareercloset.com. "
            "Professional headshots are available at Atlanta (25 Park Place, 1st Floor) and Clarkston/Dunwoody campuses "
            "during designated hours."
        ),
        "metadata": {
            "source": "Georgia State University Career Services",
            "topic": "Career Closet & Professional Headshots"
        }
    }
]

career_services_chunks.extend([
    {
        "id": "career_services_iris_1",
        "text": (
            "Georgia State University students can take free professional headshots at the Iris Booth, "
            "located at 25 Park Place NE, Suite 111, Dunwoody NB 1200, and Clarkston CN 2101. "
            "The Iris Booth is self-service, allowing students to take three photos per session, edit them "
            "(teeth whitening, blemish removal, skin softening), and receive them via email. "
            "Photos can be accessed for up to one year. The service is available Monday-Friday, 8:30 a.m.–5:15 p.m., "
            "with no appointment needed, and is funded by student technology fees."
        ),
        "metadata": {
            "source": "Georgia State University Career Services - Iris Booth",
            "topic": "Professional Headshots"
        }
    },
    {
        "id": "career_services_closet_1",
        "text": (
            "Students at Georgia State University can access the Career Closet in the same building as the Iris Booth. "
            "The Career Closet allows students to select professional clothing or items for up to five times per semester. "
            "This service is free to students and supports their preparation for internships, co-ops, and professional events."
        ),
        "metadata": {
            "source": "Georgia State University Career Services - Career Closet",
            "topic": "Career Closet"
        }
    }
])

# Data extracted from the Georgia State University Computer Science Prerequisite Chart (effective Fall 2019)
cs_prerequisite_chunks = []

cs_prerequisite_chunks.extend([
    {
        "id": "cs_prereq_general_info_1",
        "text": (
            "This information is from the Computer Science Prerequisite Chart, effective Fall 2019. "
            "A subset of the classes highlighted in red on the chart are required for the pre-major in Computer Science. "
            "For official advising, students should contact undergrad@cs.gsu.edu."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "General Advising Information"
        }
    },
    {
        "id": "cs_prereq_math1113_1",
        "text": (
            "MATH 1113 - Precalculus is a 3-credit hour course. "
            "It is a prerequisite for MATH 2211 - Calculus of One Var. I. "
            "It can be taken concurrently with CSC 1301. This course is required for the CS pre-major."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc1301_1",
        "text": (
            "CSC 1301 - Principles of Comp. Sci. I is a 4-credit hour course. "
            "It is a prerequisite for CSC 2510 and CSC 1302. "
            "It can be taken concurrently with MATH 1113. This course is required for the CS pre-major."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_math2211_1",
        "text": (
            "MATH 2211 - Calculus of One Var. I is a 4-credit hour course. "
            "Its prerequisite is MATH 1113. "
            "It is a prerequisite for MATH 2212. This course is required for the CS pre-major."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc2510_1",
        "text": (
            "CSC 2510 - Theor. Found of Comp. Sci. is a 3-credit hour course. "
            "Its prerequisite is CSC 1301. "
            "It is a prerequisite for CSC 2720. This course is required for the CS pre-major."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc1302_1",
        "text": (
            "CSC 1302 - Principles of Comp. Sci. II is a 4-credit hour course. "
            "Its prerequisites are CSC 1301 and MATH 1113. "
            "It serves as a prerequisite for CSC 2720 and CSC 3320."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_math2212_1",
        "text": (
            "MATH 2212 - Calculus of One Var. II is a 4-credit hour course. "
            "Its prerequisite is MATH 2211. "
            "It is a prerequisite for MATH 2641 and MATH 3020."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc2720_1",
        "text": (
            "CSC 2720 - Data Structures is a 3-credit hour course. "
            "Its prerequisites are CSC 1302 and CSC 2510. "
            "It is a prerequisite for many 4000-level courses, including CSC 4520, CSC 4260, CSC 4710, CSC 4360, and more."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc3210_1",
        "text": (
            "CSC 3210 - Comp. Org. and Prog. is a 4-credit hour course. "
            "It shares prerequisites with CSC 3320. "
            "It is a prerequisite for many 4000-level courses like CSC 4330, CSC 4310, CSC 4340, CSC 4810, and CSC 4210."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc3320_1",
        "text": (
            "CSC 3320 - System-Level Programming is a 3-credit hour course. "
            "Its prerequisite is CSC 1302. "
            "It is a prerequisite for many courses, including CSC 4520, CSC 4350, CSC 4330, CSC 4320, CSC 4110, and CSC 4221."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_math3020_1",
        "text": (
            "MATH 3020 - App. Prob. Stat. for CS is a 3-credit hour course. "
            "Its prerequisite is MATH 2212. "
            "It is a required prerequisite for certain advanced courses like CSC 4630 - MATLAB Prog."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc4520_1",
        "text": (
            "CSC 4520 - Analysis of Algorithms is a 3-credit hour course. "
            "Its prerequisites are CSC 2720 and CSC 3320. "
            "It is a required course. It is also part of a cluster of courses that require CSC 2720."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc4350_1",
        "text": (
            "CSC 4350 - Software Engineering is a 4-credit hour course. "
            "Its prerequisites are CSC 3210 and CSC 3320. It is also listed as a required course."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    },
    {
        "id": "cs_prereq_csc4320_1",
        "text": (
            "CSC 4320 - Operating Systems is a 4-credit hour course. "
            "Its prerequisites are CSC 3210 and CSC 3320. "
            "It serves as a prerequisite for a cluster of courses including CSC 4110 and CSC 4380."
        ),
        "metadata": {
            "source": "Computer Science Prerequisite Chart (Fall 2019)",
            "topic": "Course Prerequisites"
        }
    }
])

rcb_general_chunks = [
    {
        "id": "rcb_general_mission",
        "text": "The mission of the B.B.A. program at Georgia State's Robinson College of Business is to provide a broad general education and core business knowledge to prepare students for entry-level positions in private, public, and non-profit organizations. The program focuses on developing communication skills, technology use, problem-solving, teamwork, and a desire for lifelong learning.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Mission and Objectives"
        }
    },
    {
        "id": "rcb_admission_foundation_courses",
        "text": "To be eligible to enroll in 3000/4000-level courses in the Robinson College of Business, students must complete the following Business Foundation courses: BUSA 1105, ACCT 2101, ACCT 2102, ECON 2105, ECON 2106, and CIS 2010. A grade of C- or higher is required in each.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Admission Requirements"
        }
    },
    {
        "id": "rcb_admission_gpa_requirements",
        "text": "In addition to completing the Business Foundation courses, students must have earned at least 45 semester hours of college-level credit and achieved a GPA of 2.8 or better across the six Business Foundation courses to enroll in upper-level RCB courses. Each course may be attempted only twice.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Admission Requirements"
        }
    },
    {
        "id": "rcb_continuing_eligibility",
        "text": "Once admitted to upper-level courses, RCB students must maintain a cumulative GPA of 2.0 or higher to remain eligible. Students falling below this will have one semester to raise their GPA before becoming ineligible for 3000/4000-level courses.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Academic Regulations"
        }
    },
    {
        "id": "rcb_residence_requirement",
        "text": "At least 50 percent of the business credit hours required for the B.B.A. degree must be taken in residence at Georgia State University. This includes specific foundation courses, junior core courses, and major-specific courses.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Degree Requirements"
        }
    },
    {
        "id": "rcb_recommended_sequencing_yr1",
        "text": "Recommended first-year sequencing for B.B.A. students: Semester 1 - GSU 1010, ENGL 1101, MATH 1111 or higher, and ECON 2105 or 2106. Semester 2 - BUSA 1105, ENGL 1102, MATH 1401 (Statistics), and the other ECON course (2105 or 2106).",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Course Sequencing"
        }
    },
    {
        "id": "rcb_recommended_sequencing_yr2",
        "text": "Recommended second-year sequencing for B.B.A. students: Semester 1 - ACCT 2101 and CIS 2010. Semester 2 - ACCT 2102.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Course Sequencing"
        }
    },
    {
        "id": "rcb_junior_business_core",
        "text": "The Junior Business Core consists of five courses required for all B.B.A. majors: LGLS 3610 (Legal/Ethical Analysis), FI 3300 (Corporation Finance), MGT 3100 (Business Analysis), MGT 3400 (Managing People), and MK 3010 (Marketing Management). A grade of C- or higher is required in each.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Degree Requirements"
        }
    },
    {
        "id": "rcb_business_capstone",
        "text": "The Business Capstone Module, recommended for the final semester, consists of BUSA 4980 (Business Capstone) and BUSA 4990 (Exit Exam). Prerequisites include all Business Foundation courses, the Junior Business Core, BCOM 3950, BUSA 4000, and nine hours of upper-level major courses.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Degree Requirements"
        }
    },
    {
        "id": "rcb_academic_assistance",
        "text": "The Office of Academic Assistance in the Delta Student Success Center (55 Park Place, Suite 1201) helps B.B.A. students with program planning, transfer credits, course selection, and understanding regulations. They offer both appointments and walk-in advisement.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Student Resources"
        }
    },
    {
        "id": "rcb_career_advancement",
        "text": "The Robinson Career Advancement Center (55 Park Place, 12th Floor) provides career advising, resume critiques, mock interviews, and access to job postings via Handshake. They also host career expos and offer specialized immersive programs like Panthers on Wall Street.",
        "metadata": {
            "source": "GSU Undergraduate Catalog 2024-2025",
            "topic": "RCB Student Resources"
        }
    }
]
accounting_bba_chunks = [
    {
        "id": "acct_bba_overview",
        "text": (
            "The B.B.A. in Accounting at Georgia State University requires completion of "
            "Areas A through E (general core), Area F (Business Foundation), Junior Business Core, "
            "Major-specific courses, and electives. This plan suggests a four-year schedule "
            "but is not a substitute for academic advisement."
        ),
        "metadata": {
            "source": "2022-2023 BBA Accounting Degree Plan",
            "topic": "Accounting Degree Overview"
        }
    },
    {
        "id": "acct_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Accounting B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111 (College Algebra), PERS 2001/2, GSU 1010, and ECON 2105 (Macroeconomics). "
            "Spring term includes ENGL 1102, PHIL 1010 (Critical Thinking), MATH 1401 (Elementary Statistics), BUSA 1105, and ECON 2106 (Microeconomics). "
            "Milestones include completing Area A and starting Area F courses (which require a minimum 2.8 GPA)."
        ),
        "metadata": {
            "source": "2022-2023 BBA Accounting Degree Plan",
            "topic": "Accounting Year 1 Plan"
        }
    },
    {
        "id": "acct_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Accounting B.B.A.: "
            "Fall term includes ACCT 2101 (Principles of Accounting I), CIS 2010, POLS 1101, and Area D/E electives. "
            "Spring term includes ACCT 2102 (Principles of Accounting II), HIST 2110, and Area C/D/E electives. "
            "Crucial milestones: Complete Area F with a minimum GPA of 2.8, and earn a grade of 'B' or higher in both ACCT 2101 and ACCT 2102."
        ),
        "metadata": {
            "source": "2022-2023 BBA Accounting Degree Plan",
            "topic": "Accounting Year 2 Plan"
        }
    },
    {
        "id": "acct_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Accounting B.B.A.: "
            "Fall term focuses on BCOM 3950, MGT 3100, LGLS 3610, and major courses ACCT 4101 (Essentials of Financial Reporting I) and ACCT 4210 (Cost/Managerial Accounting). "
            "Spring term includes FI 3300, MK 3010, MGT 3400, ACCT 4102 (Essentials of Financial Reporting II), and ACCT 4310 (Accounting Information Systems). "
            "Milestone: Register with the RCB Career Management Center."
        ),
        "metadata": {
            "source": "2022-2023 BBA Accounting Degree Plan",
            "topic": "Accounting Year 3 Plan"
        }
    },
    {
        "id": "acct_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Accounting B.B.A.: "
            "Fall term includes ACCT 4750 (Technology & Values in Accounting Profession), ACCT 4510 (Federal Income Tax), BUSA 4000 (Global Business), and electives. "
            "Spring term includes the capstone BUSA 4980 (Strategic Management), BUSA 4990 (Exit Exam), ACCT 4610 (Introduction to Assurance Services), and electives. "
            "Milestone: Apply for graduation."
        ),
        "metadata": {
            "source": "2022-2023 BBA Accounting Degree Plan",
            "topic": "Accounting Year 4 Plan"
        }
    },
    {
        "id": "acct_bba_major_courses",
        "text": (
            "Required 3000/4000-level major courses for Accounting (21 hours): "
            "ACCT 4101 (Financial Reporting I), ACCT 4102 (Financial Reporting II), ACCT 4210 (Cost Managerial), "
            "ACCT 4310 (Accounting Info Systems), ACCT 4510 (Federal Income Taxes), ACCT 4610 (Assurance Services), "
            "and ACCT 4750 (Technology & Values in Accounting)."
        ),
        "metadata": {
            "source": "2022-2023 BBA Accounting Degree Plan",
            "topic": "Accounting Major Requirements"
        }
    },
    {
        "id": "acct_bba_area_f",
        "text": (
            "Area F (Business Foundation) requirements for Accounting majors (18 hours): "
            "ACCT 2101, ACCT 2102, BUSA 1105, CIS 2010, ECON 2105, and ECON 2106. "
            "Accounting majors must specifically earn a grade of 'B' or higher in ACCT 2101 and ACCT 2102."
        ),
        "metadata": {
            "source": "2022-2023 BBA Accounting Degree Plan",
            "topic": "Accounting Area F Requirements"
        }
    }
]
acct_web_chunks = [
    {
        "id": "acct_web_program_focus",
        "text": (
            "Robinson's undergraduate accounting program is designed to provide foundation-level "
            "technical and analytical knowledge. It prepares students for professional accounting fields "
            "and strongly encourages them to pursue a fifth year of study leading to the Master of Professional Accountancy degree. "
            "The profession now encompasses diverse areas such as forensic auditing, information systems assurance, "
            "corporate tax planning, and cost analysis."
        ),
        "metadata": {
            "source": "GSU Accounting B.B.A. Webpage",
            "topic": "Accounting Program Focus"
        }
    },
    {
        "id": "acct_web_projects_1",
        "text": (
            "The School of Accountancy emphasizes hands-on learning. In ACCT 4210, students create a product "
            "(like a baked good) and determine its direct material, labor, and overhead costs throughout the semester. "
            "In ACCT 4510, students advise clients on property transactions, retirement planning, and healthcare planning, "
            "including a project on optimizing IRA withdrawals using data analytics."
        ),
        "metadata": {
            "source": "GSU Accounting B.B.A. Webpage",
            "topic": "Accounting Hands-on Projects"
        }
    },
    {
        "id": "acct_web_projects_2",
        "text": (
            "Real-world projects in upper-level accounting courses include ACCT 4610, where students use "
            "Confirmation.com to perform mock audit procedures on cash balances. In ACCT 4310, students analyze "
            "credit scores for a fictional used car lot, design inventory visualization graphs, and evaluate "
            "internal control weaknesses for a convenience store chain."
        ),
        "metadata": {
            "source": "GSU Accounting B.B.A. Webpage",
            "topic": "Accounting Hands-on Projects"
        }
    },
    {
        "id": "acct_web_careers",
        "text": (
            "Graduates of the GSU Accounting program work for companies such as Amazon Logistics, "
            "Bank of America, Deloitte, Ernst & Young, SunTrust, UPS, the FBI, and the CIA. "
            "2019 graduates reported a maximum salary of $75,000, with 81% employed full-time."
        ),
        "metadata": {
            "source": "GSU Accounting B.B.A. Webpage",
            "topic": "Accounting Career Outcomes"
        }
    },
    {
        "id": "acct_web_student_orgs",
        "text": (
            "Accounting students can join several specialized organizations: "
            "Beta Alpha Psi (honor organization for financial information professionals), "
            "ALPFA (focusing on Latino leadership in the global workforce), "
            "Tau Alpha Chi (promoting excellence in taxation), "
            "NABA (National Association of Black Accountants), and "
            "ASCEND (Pan-Asian leaders in finance and accounting)."
        ),
        "metadata": {
            "source": "GSU Accounting B.B.A. Webpage",
            "topic": "Accounting Student Organizations"
        }
    },
    {
        "id": "acct_web_contact",
        "text": "The B.B.A. program director for Accounting is Siva Nathan (snathan@gsu.edu, 404-413-7225).",
        "metadata": {
            "source": "GSU Accounting B.B.A. Webpage",
            "topic": "Accounting Program Contact"
        }
    }
]
actuarial_science_chunks = [
    {
        "id": "as_bba_overview",
        "text": (
            "The B.B.A. in Actuarial Science at Georgia State University prepares students for careers "
            "as 'financial architects and social mathematicians' in insurance and financial services. "
            "The program is ranked #3 in North America for research productivity in leading actuarial journals. "
            "It requires 120 credit hours and is designed to help students pass the professional examinations "
            "required by the Society of Actuaries (SOA) or Casualty Actuarial Society (CAS)."
        ),
        "metadata": {
            "source": "GSU Actuarial Science B.B.A. Webpage & PDF Plan",
            "topic": "Actuarial Science Program Overview"
        }
    },
    {
        "id": "as_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Actuarial Science B.B.A. heavily emphasize mathematics. "
            "Fall term includes MATH 1113 (Pre-calculus), ENGL 1101, and ECON 2105. "
            "Spring term progresses immediately to MATH 2211 (Calculus I), along with ENGL 1102, BUSA 1105, and ECON 2106. "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA Actuarial Science Degree Plan",
            "topic": "Actuarial Science Year 1 Plan"
        }
    },
    {
        "id": "as_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Actuarial Science B.B.A. continue advanced mathematics. "
            "Fall term includes MATH 2212 (Calculus II), ACCT 2101, and CIS 2010. "
            "Spring term includes MATH 2215 (Multivariate Calculus) and ACCT 2102. "
            "Milestone: Complete Area F with a minimum GPA of 2.8."
        ),
        "metadata": {
            "source": "2022-2023 BBA Actuarial Science Degree Plan",
            "topic": "Actuarial Science Year 2 Plan"
        }
    },
    {
        "id": "as_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Actuarial Science B.B.A. introduce major-specific analytics. "
            "Fall term includes AS 3230 (Financial Mathematics) and MATH 4751 (Mathematical Statistics I). "
            "Spring term includes AS 4140 (Mathematical Foundations of Actuarial Science), MATH 4752 (Mathematical Statistics II), and FI 4090 (Financial Data Analytics). "
            "Crucial Milestone: Take the first SoA (Society of Actuaries) exam in May."
        ),
        "metadata": {
            "source": "2022-2023 BBA Actuarial Science Degree Plan",
            "topic": "Actuarial Science Year 3 Plan"
        }
    },
    {
        "id": "as_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Actuarial Science B.B.A. focus on advanced risk models. "
            "Fall term includes AS 4510 (Derivative Valuation & Risk Management), RMI 4680 (Regression Modeling), and either AS 4320 (Loss Models) or AS 4340 (Life Contingencies I). "
            "Spring term includes RMI 4990 (Risk Clinic), the Capstone (BUSA 4980), and either AS 4350 (Ratemaking) or AS 4360 (Life Contingencies II)."
        ),
        "metadata": {
            "source": "2022-2023 BBA Actuarial Science Degree Plan",
            "topic": "Actuarial Science Year 4 Plan"
        }
    },
    {
        "id": "as_bba_program_support",
        "text": (
            "The Actuarial Science program is supported by the Georgia State Risk Management Foundation, "
            "which has an endowment exceeding $15 million. This provides students with hundreds of thousands "
            "of dollars in scholarships annually, reimbursement for passed exam fees, early passer incentives, "
            "and exclusive mentoring opportunities."
        ),
        "metadata": {
            "source": "GSU Actuarial Science B.B.A. Webpage",
            "topic": "Actuarial Science Financial Support"
        }
    },
    {
        "id": "as_bba_careers_orgs",
        "text": (
            "Graduates of the Actuarial Science program work for companies like Aetna, AIG, Aon, Cigna, KPMG, "
            "Milliman, and State Farm. The primary student organization is the Gamma Iota Sigma fraternity (Zeta Chapter), "
            "which facilitates networking, research, and industry interaction."
        ),
        "metadata": {
            "source": "GSU Actuarial Science B.B.A. Webpage",
            "topic": "Actuarial Science Careers & Orgs"
        }
    },
    {
        "id": "as_bba_contact",
        "text": "The program advisor for Actuarial Science is Fang Yang (fyang10@gsu.edu, 404-413-7484).",
        "metadata": {
            "source": "GSU Actuarial Science B.B.A. Webpage",
            "topic": "Actuarial Science Contact"
        }
    }
]
business_economics_chunks = [
    {
        "id": "econ_bba_overview",
        "text": (
            "The B.B.A. in Business Economics at Georgia State University examines how decisions are made by businesses, "
            "governments, and households regarding limited resources. It provides fundamental analysis for understanding "
            "financial sectors and government policy. A U.S. Census Bureau study ranked economics as the third most "
            "lucrative major for college graduates."
        ),
        "metadata": {
            "source": "GSU Business Economics B.B.A. Webpage & PDF Plan",
            "topic": "Business Economics Program Overview"
        }
    },
    {
        "id": "econ_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Business Economics B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111 (College Algebra), SPCH 1000 (Human Communication), GSU 1010, and ECON 2105 (Macroeconomics). "
            "Spring term includes ENGL 1102, PHIL 1010 (Critical Thinking), MATH 1401 (Elementary Statistics), BUSA 1105, and ECON 2106 (Microeconomics). "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA Business Economics Degree Plan",
            "topic": "Business Economics Year 1 Plan"
        }
    },
    {
        "id": "econ_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Business Economics B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and Area D/E electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete all Area F courses with a minimum GPA of 2.8."
        ),
        "metadata": {
            "source": "2022-2023 BBA Business Economics Degree Plan",
            "topic": "Business Economics Year 2 Plan"
        }
    },
    {
        "id": "econ_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Business Economics B.B.A. focus on core business and major-specific theory. "
            "Fall term includes BCOM 3950, MGT 3100, MK 3010, LGLS 3610, and ECON 3900 (Macroeconomics). "
            "Spring term includes FI 3300, MGT 3400, ECON 3910 (Microeconomics), an ECON elective, and a non-RCB elective. "
            "Milestone: Register with the RCB Career Management Center."
        ),
        "metadata": {
            "source": "2022-2023 BBA Business Economics Degree Plan",
            "topic": "Business Economics Year 3 Plan"
        }
    },
    {
        "id": "econ_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Business Economics B.B.A.: "
            "Fall term includes two ECON electives, BUSA 4000 (Global Business), and both RCB and non-RCB upper-division electives. "
            "Spring term includes the capstone BUSA 4980, exit exam BUSA 4990, ECON 4999 (Senior Capstone in Economics), another ECON elective, and general electives."
        ),
        "metadata": {
            "source": "2022-2023 BBA Business Economics Degree Plan",
            "topic": "Business Economics Year 4 Plan"
        }
    },
    {
        "id": "econ_bba_careers_orgs",
        "text": (
            "Graduates with a Business Economics degree find diverse roles in marketing, finance, international operations, "
            "and government relations. Employers of GSU graduates include Care.com, Georgia-Pacific, Mohawk Industries, "
            "NCR, Truist, and UPS. The primary student organization is the Georgia State Economics Club, open to all majors."
        ),
        "metadata": {
            "source": "GSU Business Economics B.B.A. Webpage",
            "topic": "Business Economics Careers & Orgs"
        }
    },
    {
        "id": "econ_bba_contact",
        "text": "The director of undergraduate studies for Economics is Shelby Frost (sfrost@gsu.edu, 404-413-0155).",
        "metadata": {
            "source": "GSU Business Economics B.B.A. Webpage",
            "topic": "Business Economics Contact"
        }
    }
]
cis_bba_chunks = [
    {
        "id": "cis_bba_overview",
        "text": (
            "The B.B.A. in Computer Information Systems at Georgia State University produces graduates who combine "
            "business knowledge with hands-on technology skills. The program prepares students for careers in consulting, "
            "systems development, cybersecurity, data analytics, and IT project management. It is ranked #8 in the U.S. "
            "by U.S. News & World Report (2026)."
        ),
        "metadata": {
            "source": "GSU CIS B.B.A. Webpage & PDF Plan",
            "topic": "CIS Program Overview"
        }
    },
    {
        "id": "cis_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for CIS B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111 (College Algebra), PERS 2001/2, GSU 1010, and ECON 2105. "
            "Spring term includes ENGL 1102, PHIL 1010 (Critical Thinking), MATH 1401 (Elementary Statistics), BUSA 1105, and ECON 2106. "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA CIS Degree Plan",
            "topic": "CIS Year 1 Plan"
        }
    },
    {
        "id": "cis_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for CIS B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete Area F with a minimum GPA of 2.8."
        ),
        "metadata": {
            "source": "2022-2023 BBA CIS Degree Plan",
            "topic": "CIS Year 2 Plan"
        }
    },
    {
        "id": "cis_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for CIS B.B.A. focus on core technology skills. "
            "Fall term includes CIS 3260 (Intro to Programming), MGT 3100, BCOM 3950, MGT 3400, and CIS 3205E (Career Advancement Basics). "
            "Spring term includes CIS 3001 (Managing IT Projects), CIS 3300 (Systems Analysis), CIS 3730 (Database Management Systems), FI 3300, MK 3010, and LGLS 3610. "
            "Crucial Milestone: Complete CIS 3260 with a grade of B- or higher."
        ),
        "metadata": {
            "source": "2022-2023 BBA CIS Degree Plan",
            "topic": "CIS Year 3 Plan"
        }
    },
    {
        "id": "cis_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for CIS B.B.A. focus on specialized concentrations and capstone projects. "
            "Students take three specific concentration courses, BUSA 4000 (Global Business), and electives. "
            "The final semester includes the capstone (BUSA 4980), exit exam (BUSA 4990), and a major-specific field study or project (CIS 4970 or CIS 4980)."
        ),
        "metadata": {
            "source": "2022-2023 BBA CIS Degree Plan",
            "topic": "CIS Year 4 Plan"
        }
    },
    {
        "id": "cis_bba_concentrations",
        "text": (
            "CIS majors must choose one or more concentrations: "
            "1) Application Development (programming web/mobile apps, cloud computing), "
            "2) Cybersecurity (managing information assets, risk management, regulatory compliance), "
            "3) Data Analytics (big data analysis, machine learning, data visualization), or "
            "4) Digital Innovation (process modeling, designing IT systems for business transformation)."
        ),
        "metadata": {
            "source": "GSU CIS B.B.A. Webpage",
            "topic": "CIS Concentrations"
        }
    },
    {
        "id": "cis_bba_capstone_projects",
        "text": (
            "For their major capstone, CIS students choose between two real-world options: "
            "CIS 4980 involves student groups consulting with real companies to solve complex IT issues under faculty supervision. "
            "CIS 4970 is a semester-long internship or job where students apply their CIS knowledge to tasks like system design, data analysis, or project management."
        ),
        "metadata": {
            "source": "GSU CIS B.B.A. Webpage",
            "topic": "CIS Capstone Projects"
        }
    },
    {
        "id": "cis_bba_careers_orgs",
        "text": (
            "CIS graduates work for major companies like Accenture, Amazon, BlackRock, Deloitte, EY, Delta Air Lines, Microsoft, and The Home Depot. "
            "Student organizations include AIS (Association for Information Systems), AITP (Association of IT Professionals), "
            "Women in Technology (WIT), and STARS Ignite GSU."
        ),
        "metadata": {
            "source": "GSU CIS B.B.A. Webpage",
            "topic": "CIS Careers & Orgs"
        }
    },
    {
        "id": "cis_bba_contact",
        "text": "The administrative specialist for the CIS program is Alicia Gholar (agholar@gsu.edu, 404-413-7398).",
        "metadata": {
            "source": "GSU CIS B.B.A. Webpage",
            "topic": "CIS Program Contact"
        }
    }
]
finance_bba_chunks = [
    {
        "id": "finance_bba_overview",
        "text": (
            "The B.B.A. in Finance at Georgia State University provides a deep understanding of financial operations "
            "in businesses and broader financial markets. Students learn to develop strategies that maximize firm value, "
            "apply analytical tools, and manage market risks. The program is eligible for the Online B.B.A. Degree Completion Program."
        ),
        "metadata": {
            "source": "GSU Finance B.B.A. Webpage & PDF Plan",
            "topic": "Finance Program Overview"
        }
    },
    {
        "id": "finance_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Finance B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111 (College Algebra), PERS 2001/2, GSU 1010, and ECON 2105 (Macroeconomics). "
            "Spring term includes ENGL 1102, PHIL 1010 (Critical Thinking), MATH 1401 (Elementary Statistics), BUSA 1105, and ECON 2106 (Microeconomics). "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA Finance Degree Plan",
            "topic": "Finance Year 1 Plan"
        }
    },
    {
        "id": "finance_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Finance B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete all Area F courses with a minimum GPA of 2.8."
        ),
        "metadata": {
            "source": "2022-2023 BBA Finance Degree Plan",
            "topic": "Finance Year 2 Plan"
        }
    },
    {
        "id": "finance_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Finance B.B.A. introduce the major with intense coursework. "
            "Fall term includes BCOM 3950, MGT 3100, FI 3300 (Corporate Finance), MGT 3400, and LGLS 3610. "
            "Spring term features the 6-credit hour course FI 4000 (Fundamentals of Valuation), along with FI 4020 (Financial Analysis & Loan Structuring) and MK 3010. "
            "Milestone: Register with the RCB Career Management Center."
        ),
        "metadata": {
            "source": "2022-2023 BBA Finance Degree Plan",
            "topic": "Finance Year 3 Plan"
        }
    },
    {
        "id": "finance_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Finance B.B.A. focus on advanced analytics and strategy. "
            "Fall term includes FI 4090 (Financial Data Analytics), two Finance electives, BUSA 4000, and an RCB elective. "
            "Spring term includes the capstone BUSA 4980, exit exam BUSA 4990, another Finance elective, and general electives."
        ),
        "metadata": {
            "source": "2022-2023 BBA Finance Degree Plan",
            "topic": "Finance Year 4 Plan"
        }
    },
    {
        "id": "finance_bba_honors_track",
        "text": (
            "The Department of Finance offers a specialized Honors Track. It comprises 18 credit hours over two semesters "
            "for high-achieving students. Benefits include a cohort-based learning model, exclusive access to national job markets "
            "and top graduate schools, access to the Signature Programs lounge, and participation in events like the CFA Institute Global Investment Challenge."
        ),
        "metadata": {
            "source": "GSU Finance B.B.A. Webpage",
            "topic": "Finance Honors Track"
        }
    },
    {
        "id": "finance_bba_careers_orgs",
        "text": (
            "Finance graduates work for companies like BlackRock, Blackstone, Truist Securities, Citi, and Deloitte Consulting. "
            "Key student organizations include the Georgia State Finance Society, the Atlanta Student Investors Club (ASIC), "
            "and the highly active Investment Management Group (IMG), which manages portfolios and creates professional pitch decks."
        ),
        "metadata": {
            "source": "GSU Finance B.B.A. Webpage",
            "topic": "Finance Careers & Orgs"
        }
    },
    {
        "id": "finance_bba_contact",
        "text": (
            "The Department Chair for Finance is Gerald Gay (ggay@gsu.edu, 404-413-7321). "
            "For the Honors Track, contact David R. Beard (dbeard@gsu.edu, 404-413-7349)."
        ),
        "metadata": {
            "source": "GSU Finance B.B.A. Webpage",
            "topic": "Finance Program Contacts"
        }
    }
]
entrepreneurship_chunks = [
    {
        "id": "eni_bba_overview",
        "text": (
            "The B.B.A. in Entrepreneurship at Georgia State focuses on developing an entrepreneurial mindset "
            "for creating new ventures or innovating within existing organizations. It provides foundational skills "
            "in problem-solving, critical thinking, and addressing customer needs. The program is designed to help "
            "students launch their own businesses or secure roles in fast-paced industries."
        ),
        "metadata": {
            "source": "GSU Entrepreneurship B.B.A. Webpage",
            "topic": "Entrepreneurship Program Overview"
        }
    },
    {
        "id": "eni_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Entrepreneurship B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111, PERS 2001/2, GSU 1010, and ECON 2105. "
            "Spring term includes ENGL 1102, PHIL 1010, MATH 1401 (Statistics), BUSA 1105, and ECON 2106. "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA Entrepreneurship Degree Plan",
            "topic": "Entrepreneurship Year 1 Plan"
        }
    },
    {
        "id": "eni_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Entrepreneurship B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete Area F with a 2.8 GPA and explore MGS (Management) career tracks."
        ),
        "metadata": {
            "source": "2022-2023 BBA Entrepreneurship Degree Plan",
            "topic": "Entrepreneurship Year 2 Plan"
        }
    },
    {
        "id": "eni_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Entrepreneurship B.B.A. begin the core major sequence. "
            "Fall term includes ENI 3101 (Entrepreneurial Thinking), BCOM 3950, MGT 3100, MK 3010, and LGLS 3610. "
            "Spring term includes ENI 3102 (Product-Service Design for New Ventures), FI 3300, MGT 3400, and an ENI elective."
        ),
        "metadata": {
            "source": "2022-2023 BBA Entrepreneurship Degree Plan",
            "topic": "Entrepreneurship Year 3 Plan"
        }
    },
    {
        "id": "eni_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Entrepreneurship B.B.A. focus on launching and scaling. "
            "Fall term includes ENI 3103 (Business Model Validation), BUSA 4000, and an ENI elective. "
            "Spring term features the major capstone ENI 4100 (Scaling a New Venture), alongside the BUSA 4980 strategic management capstone."
        ),
        "metadata": {
            "source": "2022-2023 BBA Entrepreneurship Degree Plan",
            "topic": "Entrepreneurship Year 4 Plan"
        }
    },
    {
        "id": "eni_bba_highlights",
        "text": (
            "Key highlights of the Entrepreneurship program include: "
            "1) LaunchGSU (a student incubator for building ventures), "
            "2) E-House (a living-learning community for student entrepreneurs), and "
            "3) The Main Street Entrepreneurs Seed Fund (providing funding and mentorship to underrepresented founders)."
        ),
        "metadata": {
            "source": "GSU Entrepreneurship B.B.A. Webpage",
            "topic": "Entrepreneurship Program Highlights"
        }
    },
    {
        "id": "eni_bba_careers_orgs",
        "text": (
            "Entrepreneurship graduates often launch their own companies, work in startups, or join innovation teams in larger firms. "
            "Student opportunities include the Social Entrepreneurship Club (SENC) and Digital Learners to Leaders."
        ),
        "metadata": {
            "source": "GSU Entrepreneurship B.B.A. Webpage",
            "topic": "Entrepreneurship Careers & Orgs"
        }
    },
    {
        "id": "eni_bba_contact",
        "text": "The Entrepreneurship and Innovation Institute (ENI) can be contacted at eni@gsu.edu or 404-413-7910.",
        "metadata": {
            "source": "GSU Entrepreneurship B.B.A. Webpage",
            "topic": "Entrepreneurship Contact"
        }
    }
]
hospitality_chunks = [
    {
        "id": "hadm_bba_overview",
        "text": (
            "The B.B.A. in Hospitality Administration at Georgia State University provides an integrated curriculum "
            "combining general business, hospitality-specific courses, and arts and sciences. It prepares students "
            "for management positions in the industry through core coursework, specialized electives, and work-study experiences. "
            "The program is eligible for the Online B.B.A. Degree Completion Program."
        ),
        "metadata": {
            "source": "GSU Hospitality Administration B.B.A. Webpage & PDF Plan",
            "topic": "Hospitality Program Overview"
        }
    },
    {
        "id": "hadm_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Hospitality B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111, PERS 2001/2, GSU 1010, and ECON 2105. "
            "Spring term includes ENGL 1102, PHIL 1010, MATH 1401 (Statistics), BUSA 1105, and ECON 2106. "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2023 Hospitality Guide Checklist",
            "topic": "Hospitality Year 1 Plan"
        }
    },
    {
        "id": "hadm_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Hospitality B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and Area D/E electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete all Area F courses with a minimum GPA of 2.8."
        ),
        "metadata": {
            "source": "2023 Hospitality Guide Checklist",
            "topic": "Hospitality Year 2 Plan"
        }
    },
    {
        "id": "hadm_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Hospitality B.B.A. introduce major-specific core concepts. "
            "Fall term includes HADM 3010 (Perspectives in Hospitality), BCOM 3950, MGT 3100, MK 3010, and LGLS 3610. "
            "Spring term includes HADM 3403 (Business Analytics for Restaurant Mgt), FI 3300, MGT 3400, and two HADM electives. "
            "Milestone: Register with the RCB Career Management Center."
        ),
        "metadata": {
            "source": "2023 Hospitality Guide Checklist",
            "topic": "Hospitality Year 3 Plan"
        }
    },
    {
        "id": "hadm_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Hospitality B.B.A. focus on leadership and strategy. "
            "Fall term includes HADM 3720 (Hospitality Law), HADM 3750 (HR Management), HADM 3760 (Branding & Distribution), and an elective. "
            "Spring term includes HADM 4100 (Financial Analysis), HADM 4800 (Strategic Leadership), HADM 4900 (Field Experience), and the business capstone sequence (BUSA 4980/4990)."
        ),
        "metadata": {
            "source": "2023 Hospitality Guide Checklist",
            "topic": "Hospitality Year 4 Plan"
        }
    },
    {
        "id": "hadm_bba_highlights_certs",
        "text": (
            "Hospitality students can earn multiple industry certifications, including Certification in Hotel Industry Analytics (CHIA), "
            "ServSafe (Food Safety), Cvent (Event Marketing), and Digital Marketing. "
            "Experiential highlights include the European Hospitality Experience study abroad trip, planning the annual Hunter Hotel Conference, "
            "and participating in the Smith Travel Research Market Study Competition in NYC."
        ),
        "metadata": {
            "source": "GSU Hospitality Administration B.B.A. Webpage",
            "topic": "Hospitality Certifications & Highlights"
        }
    },
    {
        "id": "hadm_bba_careers_orgs",
        "text": (
            "Hospitality students benefit from numerous specialized organizations for networking and career development: "
            "American Hotel & Lodging Association, Eta Sigma Delta (honor society), Georgia Restaurant Organization, "
            "Club Managers Association of America, International Association of Exhibitions and Events, and the National Society of Minorities in Hospitality."
        ),
        "metadata": {
            "source": "GSU Hospitality Administration B.B.A. Webpage",
            "topic": "Hospitality Careers & Orgs"
        }
    },
    {
        "id": "hadm_bba_contact",
        "text": "The Cecil B. Day School of Hospitality Administration can be contacted at hospitality@gsu.edu.",
        "metadata": {
            "source": "GSU Hospitality Administration B.B.A. Webpage",
            "topic": "Hospitality Program Contact"
        }
    }
]
management_bba_chunks = [
    {
        "id": "mgt_bba_overview",
        "text": (
            "The B.B.A. in Management at Georgia State University prepares graduates for positions in "
            "business analytics, consulting, human resources, operations management, and entrepreneurship. "
            "Students must select one of four concentrations. The Business Analysis concentration is eligible "
            "for the Online B.B.A. Degree Completion program."
        ),
        "metadata": {
            "source": "GSU Management B.B.A. Webpage & PDF Plan",
            "topic": "Management Program Overview"
        }
    },
    {
        "id": "mgt_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Management B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111, PERS 2001/2, GSU 1010, and ECON 2105. "
            "Spring term includes ENGL 1102, PHIL 1010, MATH 1401 (Statistics), BUSA 1105, and ECON 2106. "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA Management Degree Plan",
            "topic": "Management Year 1 Plan"
        }
    },
    {
        "id": "mgt_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Management B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete Area F with a 2.8 GPA and explore MGS career tracks."
        ),
        "metadata": {
            "source": "2022-2023 BBA Management Degree Plan",
            "topic": "Management Year 2 Plan"
        }
    },
    {
        "id": "mgt_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Management B.B.A. introduce core management concepts. "
            "Fall term includes BCOM 3950, MGT 3100, MK 3010, MGT 3400, and LGLS 3610. "
            "Spring term includes FI 3300, MGT 4700 (Operations Management), MGT 4300 (Managing Human Resources), and electives. "
            "Milestone: Register with the RCB Career Management Center."
        ),
        "metadata": {
            "source": "2022-2023 BBA Management Degree Plan",
            "topic": "Management Year 3 Plan"
        }
    },
    {
        "id": "mgt_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Management B.B.A. focus on specific concentrations. "
            "Fall term includes one concentration course, an MGT elective, BUSA 4000, and other electives. "
            "Spring term includes two more concentration courses, another MGT elective, and the capstone sequence (BUSA 4980/4990)."
        ),
        "metadata": {
            "source": "2022-2023 BBA Management Degree Plan",
            "topic": "Management Year 4 Plan"
        }
    },
    {
        "id": "mgt_bba_concentrations",
        "text": (
            "Management majors must choose one of four concentrations: "
            "1) Business Analysis (courses like MGT 4020 Business Intelligence, MGT 4110 Data Analysis), "
            "2) Human Resource Management (courses like MGT 4320 Legal Environment of HR, MGT 4360 Selection, MGT 4390 Compensation), "
            "3) Management Consulting, or "
            "4) Supply Chain and Operations Management (courses like MGT 4710 Supply Chain Mgt, MGT 4730 Project Mgt)."
        ),
        "metadata": {
            "source": "GSU Management B.B.A. Webpage & PDF Plan",
            "topic": "Management Concentrations"
        }
    },
    {
        "id": "mgt_bba_hands_on",
        "text": (
            "In MGT 3400 (Managing People in Organizations), student teams must raise a minimum of $250 "
            "for a nonprofit organization of their choice. They must overcome group dynamics hurdles and often "
            "engage with the business community to secure event space. They present a check to the charity at the end of the course."
        ),
        "metadata": {
            "source": "GSU Management B.B.A. Webpage",
            "topic": "Management Hands-on Projects"
        }
    },
    {
        "id": "mgt_bba_careers_contact",
        "text": (
            "Management graduates work for companies like Amazon, Deloitte, Porsche Cars North America, and The Home Depot. "
            "Program contacts include Dr. Frank Lee (Business Analytics), Dr. Gabriella Lewis (HR), "
            "Dr. Alex Tawse (Consulting), and Dr. Issam Moussaoui (Supply Chain)."
        ),
        "metadata": {
            "source": "GSU Management B.B.A. Webpage",
            "topic": "Management Careers & Contacts"
        }
    }
]
marketing_bba_chunks = [
    {
        "id": "mkt_bba_overview",
        "text": (
            "The B.B.A. in Marketing at Georgia State University provides fundamental preparation in "
            "understanding markets, customers, product development, pricing strategies, advertising, and distribution. "
            "The program is ranked #35 nationally by U.S. News & World Report (2023) and is eligible for the "
            "Online B.B.A. Degree Completion Program."
        ),
        "metadata": {
            "source": "GSU Marketing B.B.A. Webpage & PDF Plan",
            "topic": "Marketing Program Overview"
        }
    },
    {
        "id": "mkt_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Marketing B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111 (College Algebra), PERS 2001/2, GSU 1010, and ECON 2105. "
            "Spring term includes ENGL 1102, PHIL 1010 (Critical Thinking), MATH 1401 (Elementary Statistics), BUSA 1105, and ECON 2106. "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA Marketing Degree Plan",
            "topic": "Marketing Year 1 Plan"
        }
    },
    {
        "id": "mkt_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Marketing B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete Area F with a 2.8 GPA and explore marketing career tracks."
        ),
        "metadata": {
            "source": "2022-2023 BBA Marketing Degree Plan",
            "topic": "Marketing Year 2 Plan"
        }
    },
    {
        "id": "mkt_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Marketing B.B.A. introduce core metrics and behavior. "
            "Fall term includes MK 3010 (Marketing Management), BCOM 3950, MGT 3100, FI 3300, and MK 4100 (Buyer Behavior). "
            "Spring term includes MK 4010 (Marketing Metrics), MGT 3400, LGLS 3610, and electives. "
            "Milestone: Register with the RCB Career Management Center."
        ),
        "metadata": {
            "source": "2022-2023 BBA Marketing Degree Plan",
            "topic": "Marketing Year 3 Plan"
        }
    },
    {
        "id": "mkt_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Marketing B.B.A. focus on research and strategy. "
            "Fall term includes MK 4200 (Marketing Research), BUSA 4000, and two Marketing electives. "
            "Spring term features the major capstone MK 4900 (Marketing Strategy), alongside the general business capstone BUSA 4980."
        ),
        "metadata": {
            "source": "2022-2023 BBA Marketing Degree Plan",
            "topic": "Marketing Year 4 Plan"
        }
    },
    {
        "id": "mkt_bba_highlights",
        "text": (
            "Marketing students have the option to pursue an additional undergraduate certificate in Professional Sales. "
            "The program emphasizes hands-on opportunities and innovation in the classroom to help students develop "
            "practical networks and leadership skills."
        ),
        "metadata": {
            "source": "GSU Marketing B.B.A. Webpage",
            "topic": "Marketing Program Highlights"
        }
    },
    {
        "id": "mkt_bba_careers_orgs",
        "text": (
            "Marketing graduates work for major companies like Adobe, Amazon, American Airlines, AT&T, Coca-Cola, "
            "and Delta Air Lines. Key student organizations include the American Marketing Association (AMA) "
            "for networking and the Sales Club for practicing negotiation skills."
        ),
        "metadata": {
            "source": "GSU Marketing B.B.A. Webpage",
            "topic": "Marketing Careers & Orgs"
        }
    },
    {
        "id": "mkt_bba_contact",
        "text": "The contact for the Department of Marketing is Kenneth Schroeder (kschroeder@gsu.edu).",
        "metadata": {
            "source": "GSU Marketing B.B.A. Webpage",
            "topic": "Marketing Contact"
        }
    }
]
real_estate_chunks = [
    {
        "id": "re_bba_overview",
        "text": (
            "The B.B.A. in Real Estate at Georgia State University offers a broad curriculum balancing theory and practice "
            "in appraisal, corporate real estate, development, finance, investments, and market analysis. "
            "The program is ranked #14 nationally and #9 among public universities by U.S. News & World Report (2025)."
        ),
        "metadata": {
            "source": "GSU Real Estate B.B.A. Webpage & PDF Plan",
            "topic": "Real Estate Program Overview"
        }
    },
    {
        "id": "re_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for Real Estate B.B.A.: "
            "Fall term includes ENGL 1101, MATH 1111 (College Algebra), PERS 2001/2, GSU 1010, and ECON 2105. "
            "Spring term includes ENGL 1102, PHIL 1010, MATH 1401 (Statistics), BUSA 1105, and ECON 2106. "
            "Milestone: Begin Area F courses with a minimum 2.8 GPA required."
        ),
        "metadata": {
            "source": "2022-2023 BBA Real Estate Degree Plan",
            "topic": "Real Estate Year 1 Plan"
        }
    },
    {
        "id": "re_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for Real Estate B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, POLS 1101, and Area D/E electives. "
            "Spring term includes ACCT 2102, HIST 2110, and Area C/D/E electives. "
            "Milestone: Complete all Area F courses with a minimum GPA of 2.8."
        ),
        "metadata": {
            "source": "2022-2023 BBA Real Estate Degree Plan",
            "topic": "Real Estate Year 2 Plan"
        }
    },
    {
        "id": "re_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for Real Estate B.B.A. begin the major sequence. "
            "Fall term includes RE 3010 (Real Estate Principles), BCOM 3950, MGT 3100, MK 3010, and LGLS 3610. "
            "Spring term includes RE 4150 (Real Estate Finance), RE 4050 (Real Estate Development), FI 3300, and MGT 3400. "
            "Milestone: Register with the RCB Career Management Center."
        ),
        "metadata": {
            "source": "2022-2023 BBA Real Estate Degree Plan",
            "topic": "Real Estate Year 3 Plan"
        }
    },
    {
        "id": "re_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for Real Estate B.B.A. focus on advanced analysis. "
            "Fall term includes RE 4160 (Investment Analysis), an RE elective, BUSA 4000, and other electives. "
            "Spring term includes the major capstone RE 4700 (Real Estate Analysis) alongside the BUSA 4980/4990 sequence."
        ),
        "metadata": {
            "source": "2022-2023 BBA Real Estate Degree Plan",
            "topic": "Real Estate Year 4 Plan"
        }
    },
    {
        "id": "re_bba_highlights_careers",
        "text": (
            "Real Estate students engage in hands-on learning, such as touring assets like Centennial Tower in RE 4050. "
            "Graduates work for companies like Jones Lang LaSalle, RaceTrac, and Adams Commercial Real Estate. "
            "The key student organization is the Commercial Real Estate Group, which offers property tours, technical workshops, and recruiting resources."
        ),
        "metadata": {
            "source": "GSU Real Estate B.B.A. Webpage",
            "topic": "Real Estate Highlights & Careers"
        }
    },
    {
        "id": "re_bba_contact",
        "text": "The contact for the Department of Real Estate is Thao Le (tle116@gsu.edu, 404-413-7725).",
        "metadata": {
            "source": "GSU Real Estate B.B.A. Webpage",
            "topic": "Real Estate Contact"
        }
    }
]
rmi_chunks = [
    {
        "id": "rmi_bba_overview",
        "text": (
            "The B.B.A. in Risk Management & Insurance at Georgia State prepares students to predict and mitigate "
            "financial setbacks for organizations. It is ranked #3 nationally by U.S. News & World Report (2025) "
            "and is a Center of Actuarial Excellence. The program is known for high recruitment rates and significant financial support for students."
        ),
        "metadata": {
            "source": "GSU RMI B.B.A. Webpage & PDF Plan",
            "topic": "RMI Program Overview"
        }
    },
    {
        "id": "rmi_bba_year1",
        "text": (
            "First-year (Freshman) recommended courses for RMI B.B.A. have a stronger math focus than standard business majors. "
            "Fall term suggests MATH 1220 (Survey of Calculus) or MATH 1113 (Precalculus), along with ENGL 1101 and ECON 2105. "
            "Spring term includes MATH 1401 (Elementary Statistics), ENGL 1102, BUSA 1105, and ECON 2106. "
            "Milestone: Complete ECON classes and start Calculus."
        ),
        "metadata": {
            "source": "2022-2023 Risk Management & Insurance Degree Plan",
            "topic": "RMI Year 1 Plan"
        }
    },
    {
        "id": "rmi_bba_year2",
        "text": (
            "Second-year (Sophomore) recommended courses for RMI B.B.A.: "
            "Fall term includes ACCT 2101, CIS 2010, and Area D/E electives. "
            "Spring term includes ACCT 2102, HIST 2110, and further electives. "
            "Milestone: Maintain a 2.8 GPA in these Business Foundation classes."
        ),
        "metadata": {
            "source": "2022-2023 Risk Management & Insurance Degree Plan",
            "topic": "RMI Year 2 Plan"
        }
    },
    {
        "id": "rmi_bba_year3",
        "text": (
            "Third-year (Junior) recommended courses for RMI B.B.A. begin the rigid core sequence. "
            "Fall term includes RMI 3500 (Principles of RMI), MGT 3100, BCOM 3950, and MK 3010. "
            "Spring term includes RMI 3751 (Risk Assessment Methods), the first major elective, FI 3300, LGLS 3610, and MGT 3400. "
            "Milestone: Register with the RCB Career Advancement Center."
        ),
        "metadata": {
            "source": "2022-2023 Risk Management & Insurance Degree Plan",
            "topic": "RMI Year 3 Plan"
        }
    },
    {
        "id": "rmi_bba_year4",
        "text": (
            "Fourth-year (Senior) recommended courses for RMI B.B.A. focus on track-specific major courses. "
            "Fall term includes two required major courses, an RMI elective, BUSA 4000, and a general elective. "
            "Spring term includes the fourth required major course, electives, and the capstone sequence (BUSA 4980/4990)."
        ),
        "metadata": {
            "source": "2022-2023 Risk Management & Insurance Degree Plan",
            "topic": "RMI Year 4 Plan"
        }
    },
    {
        "id": "rmi_bba_tracks_highlights",
        "text": (
            "RMI majors can choose between the Insurance Track (corporate perspective) or the Quantitative Risk Management Track (mathematical modeling). "
            "The program has a $15 million endowment, offering $500/year to eligible sophomores/juniors and $2,000/year to Pell-eligible students."
        ),
        "metadata": {
            "source": "GSU RMI B.B.A. Webpage",
            "topic": "RMI Tracks & Financial Support"
        }
    },
    {
        "id": "rmi_bba_careers_orgs",
        "text": (
            "RMI graduates are heavily recruited by carriers (AIG, Chubb, State Farm), brokers (Marsh, Aon, Willis Towers Watson), and others. "
            "The key student organization is Gamma Iota Sigma (Zeta Chapter), which facilitates industry interaction and networking."
        ),
        "metadata": {
            "source": "GSU RMI B.B.A. Webpage",
            "topic": "RMI Careers & Orgs"
        }
    },
    {
        "id": "rmi_bba_contact",
        "text": "The B.B.A. program director for Risk Management & Insurance is Harold Weston (hweston@gsu.edu, 404-413-7480).",
        "metadata": {
            "source": "GSU RMI B.B.A. Webpage",
            "topic": "RMI Program Contact"
        }
    }
]
robinson_extra_chunks = [
    # --- Experiential Signature Programs ---
    {
        "id": "sig_prog_pace",
        "text": (
            "Panthers Accelerated Career Experience (PACE) is a signature program where student teams act as "
            "consultants for a real company to solve a business problem. At the end of the semester, "
            "students present their recommendations directly to the client."
        ),
        "metadata": {
            "source": "GSU Robinson Signature Programs Webpage",
            "topic": "Experiential Learning (PACE)"
        }
    },
    {
        "id": "sig_prog_trips_dc_valley_wallst",
        "text": (
            "Robinson offers specialized immersive trips for varied career interests: "
            "'Panthers in the District' takes accounting and public policy students to D.C.; "
            "'Panthers in the Valley' takes analytics, CIS, fintech, and entrepreneurship students to Silicon Valley; "
            "and 'Panthers on Wall Street' takes finance, accounting, economics, and real estate students to NYC's financial district."
        ),
        "metadata": {
            "source": "GSU Robinson Signature Programs Webpage",
            "topic": "Immersive Career Trips"
        }
    },
    {
        "id": "sig_prog_rise",
        "text": (
            "Robinson Immersive Sophomore Experience (RISE) is a semester-long program specifically for second-year students. "
            "It includes an intense personal and career development course, internship opportunities, mentoring, "
            "networking events, and a speaker series."
        ),
        "metadata": {
            "source": "GSU Robinson Signature Programs Webpage",
            "topic": "Experiential Learning (RISE)"
        }
    },
    {
        "id": "sig_prog_womenlead",
        "text": (
            "WomenLead is a university-wide program offering coursework to help students emerge more confident "
            "in their leadership abilities. It is designed to empower students to succeed and thrive in various fields."
        ),
        "metadata": {
            "source": "GSU Robinson Signature Programs Webpage",
            "topic": "Leadership Programs"
        }
    },
    {
        "id": "sig_prog_ubre",
        "text": (
            "Undergraduate Business Research Experience (UBRE) is a paid opportunity for students to engage in "
            "stimulating business research, explore research careers, attend conferences, and network with world-class faculty."
        ),
        "metadata": {
            "source": "GSU Robinson Signature Programs Webpage",
            "topic": "Research Opportunities"
        }
    },

    # --- Minors ---
    {
        "id": "rcb_minor_offerings",
        "text": (
            "The Robinson College of Business offers minors to help students broaden their career opportunities. "
            "Available minors include Actuarial Science, Business Law, Computer Information Systems, Entrepreneurship, "
            "Finance, Hospitality Administration, International Business, Management, Marketing, Real Estate, and Risk Management & Insurance."
        ),
        "metadata": {
            "source": "GSU Robinson Minors Webpage",
            "topic": "Business Minors"
        }
    },

    # --- International Engagement ---
    {
        "id": "rcb_intl_virtual_exchange",
        "text": (
            "All undergraduate business students must complete the core course BUSA 4000 (Global Business). "
            "A major assignment in this course is the 'Virtual Exchange Project,' where student teams collaborate "
            "virtually with peers from a school in another country (e.g., Tunisia) to solve a real international business challenge."
        ),
        "metadata": {
            "source": "GSU Robinson International Engagement Webpage",
            "topic": "International Virtual Exchange"
        }
    },
    {
        "id": "rcb_intl_rankings",
        "text": (
            "Robinson College is a top destination for international students. Highly ranked programs for international "
            "undergraduates include Risk Management & Insurance (#3 in U.S.), Computer Information Systems (#8 in U.S.), "
            "and Real Estate (#12 in U.S.)."
        ),
        "metadata": {
            "source": "GSU Robinson International Engagement Webpage",
            "topic": "International Program Rankings"
        }
    }
]'''

nursing_bsn_chunks = [
    {
        "id": "nursing_overview",
        "text": (
            "The Georgia State University Traditional Bachelor of Science in Nursing (B.S.N.) program is designed for students "
            "who do not already hold licensure as registered nurses[cite: 2]. The program requires a minimum of 123 semester hours "
        "and is designed to be completed in eight semesters (four years)[cite: 1, 2]. The curriculum is built on a strong "
        "foundation of liberal arts and includes theoretical and clinical nursing practice[cite: 2]. The College of Nursing "
        "is fully approved by the Georgia Board of Nursing and accredited by the Commission on Collegiate Nursing Education (CCNE)[cite: 2]."
        ),
        "metadata": {
            "source": "GSU Nursing Catalog & Admissions Page",
            "topic": "Nursing Program Overview and Structure"
        }
    },
    {
        "id": "nursing_admission_eligibility",
        "text": (
            "Students must first apply and be accepted to the university as exploratory nursing students[cite: 2]. "
        "To apply to the professional program, students must meet several criteria: "
        "1) Complete the nursing professional program application[cite: 2]. "
        "2) Achieve a minimum science and program GPA of 3.0[cite: 2]. "
       "3) Take the Test Essential Academic Skills (TEAS) exam[cite: 2]. "
        "4) Submit a resume that includes volunteer work[cite: 2]. "
       "5) Supply a signed letter of recommendation, preferably academic, on official letterhead[cite: 2]. "
        "A person may only apply to the program twice[cite: 2]."
        ),
        "metadata": {
            "source": "GSU Nursing Catalog & Admissions Page",
            "topic": "Nursing Admissions Criteria"
        }
    },
    {
        "id": "nursing_prerequisite_courses",
        "text": (
            "Prerequisites for the nursing major include 18 credit hours of specialized courses. "
            "Key science prerequisites are BIOL 2251K (Anatomy and Physiology I, 4 hours) and BIOL 2252K (Anatomy and Physiology II, 4 hours)[cite: 1]. [cite_start]These BIOL courses cannot be older than five years old[cite: 2]. "
        "Other required courses are BIOL 2260 & 2260L (Foundations of Microbiology, 4 hours total), NURS 2010 (Health and Human Development, 3 hours), and NURS 2200 (Introduction to Nutrition, 3 hours)[cite: 1, 2]. "
       "Students are encouraged to take PHIL 1010 (Critical Thinking) and PSYC 1101 (Psychopathology and Abnormal Psychology) as social science foundations[cite: 1, 2]."
        ),
        "metadata": {
            "source": "GSU Nursing Catalog & Admissions Page",
            "topic": "Nursing Prerequisite Courses"
        }
    },
    {
        "id": "nursing_major_courses",
        "text": (
            "The Nursing Major curriculum requires 54 hours of coursework. "
            "Core major courses include NURS 3065 (Pathophysiology), NURS 3066 (Pharmacology), NURS 3162 (Medical Surgical I), NURS 3530 (Medical Surgical II), and NURS 3810 (Psychiatric/Mental Health Care)[cite: 1]. "
        "Advanced courses include NURS 4600 (Leadership and Management), NURS 4610 (Senior Practicum), and NURS 4620 (Complex Health Care Problems)[cite: 1]. "
        "Students also take NURS 3500 (Research Methods) and PSYC 3140 (Psychopathology and Abnormal Psychology) as allied field courses[cite: 1]."
        ),
        "metadata": {
            "source": "GSU Nursing Catalog & Admissions Page",
            "topic": "Nursing Major Curriculum"
        }
    },
    {
        "id": "nursing_careers",
        "text": (
            "Nursing is a critical component of patient care, with nurses acting as patients’ primary caregivers throughout the lifespan[cite: 2]. "
        "Nurses work in a variety of settings such as hospitals, clinics, agencies, and schools[cite: 2]. "
       "Nursing students rotate through many of these settings during the degree program and often find employment before graduation[cite: 2]."
        ),
        "metadata": {
            "source": "GSU Nursing Catalog & Admissions Page",
            "topic": "Nursing Career Path"
        }
    },
    {
        "id": "nursing_contact",
        "text": (
           "The School of Nursing can be contacted via email at cnhpoaa@gsu.edu or by phone at 404-413-1000[cite: 2]. "
        "The Office of Academic Assistance is located at 140 Decatur Street SE, Atlanta, GA 30303-3995[cite: 2]."
        ),
        "metadata": {
            "source": "GSU Nursing Catalog & Admissions Page",
            "topic": "Nursing Contact Information"
        }
    }
]
rn_bsn_chunks = [
    {
        "id": "rn_bsn_overview",
        "text": (
            "The R.N. to B.S.N. degree completion program is designed for practicing registered nurses who already hold "
            "an associate degree in nursing or a nursing diploma[cite: 3]. [cite_start]The program is offered entirely online [cite: 1] "
        "and requires 30 credit hours[cite: 1]. It can be completed in just three semesters, though flexible pathways "
        "of less than nine credit hours per semester are also available[cite: 3]. The baccalaureate degree program is "
        "accredited by the Commission on Collegiate Nursing Education (CCNE)[cite: 4]."
        ),
        "metadata": {
            "source": "GSU RN to BSN Program Webpage",
            "topic": "RN-BSN Program Structure and Duration"
        }
    },
    {
        "id": "rn_bsn_admissions_criteria",
        "text": (
            "Admission requirements for the R.N. to B.S.N. program include application and acceptance to both the university and the School of Nursing[cite: 5]. "
        "Applicants must be licensed to practice as a registered nurse in Georgia, or academically prepared to take the NCLEX (licensure must be obtained by the end of the first semester)[cite: 5]. "
        "A current resume and one letter of recommendation (professional or academic) on letterhead are required[cite: 5]. "
       "The minimum overall grade point average required for admission consideration is 2.5[cite: 6]. "
       "International students who hold an F1 Visa are not eligible to apply for this program[cite: 7]."
        ),
        "metadata": {
            "source": "GSU RN to BSN Program Webpage",
            "topic": "RN-BSN Admissions and Licensure"
        }
    },
    {
        "id": "rn_bsn_course_requirements",
        "text": (
            "Applicants are eligible for admission consideration even if they have one to four IMPACTS curriculum courses left to complete[cite: 6]. "
       "A minimum grade of C or higher is required for each IMPACTS course[cite: 6]. "
        "Course credit is given for certain existing courses based on current R.N. licensure and successful completion of 9 credit hours of the R.N. to B.S.N. nursing curriculum[cite: 7]."
        ),
        "metadata": {
            "source": "GSU RN to BSN Program Webpage",
            "topic": "RN-BSN Course Requirements and Credit Transfer"
        }
    },
    {
        "id": "rn_bsn_careers_advancement",
        "text": (
            "The R.N. to B.S.N. program is recommended for nurses interested in advancing their careers into leadership and specialty positions[cite: 8]. "
        "Graduates are prepared for exciting fields such as critical care, labor and delivery, and cardiac medicine[cite: 8]. "
        "Many graduates have pursued advanced roles such as nurse practitioners, nurse educators, CRNAs, or continued their education through graduate studies at GSU or other competitive programs[cite: 8]."
        ),
        "metadata": {
            "source": "GSU RN to BSN Program Webpage",
            "topic": "RN-BSN Career Advancement"
        }
    },
    {
        "id": "rn_bsn_contact",
        "text": (
            "For admissions and curriculum inquiries, contact Dee Williams at soninfo@gsu.edu. "
            "The general contact for Online Programs is 404-413-4393 or online@gsu.edu[cite: 9]. "
      "The Byrdine F. Lewis College of Nursing and Health Professions Office of Academic Assistance can be reached at 404-413-1000[cite: 10]."
        ),
        "metadata": {
            "source": "GSU RN to BSN Program Webpage",
            "topic": "RN-BSN Contact Information"
        }
    }
]


# === ADD THIS AT THE VERY END OF YOUR data_chunks.py FILE ===

# Master list to consolidate all chunks for easy processing
all_chunks = []
'''all_chunks.extend(chunks)
all_chunks.extend(chunks_structured)
all_chunks.extend(career_services_chunks)
all_chunks.extend(cs_prerequisite_chunks)
all_chunks.append(cs_degree_requirements_chunk) # Use .append for the single dictionary
all_chunks.extend(rcb_general_chunks)
all_chunks.extend(accounting_bba_chunks)
all_chunks.extend(acct_web_chunks)
all_chunks.extend(actuarial_science_chunks)
all_chunks.extend(business_economics_chunks)
all_chunks.extend(cis_bba_chunks)
all_chunks.extend(finance_bba_chunks)
all_chunks.extend(entrepreneurship_chunks)
all_chunks.extend(hospitality_chunks)
all_chunks.extend(management_bba_chunks)
all_chunks.extend(marketing_bba_chunks)
all_chunks.extend(real_estate_chunks)
all_chunks.extend(rmi_chunks)
all_chunks.extend(robinson_extra_chunks)'''
all_chunks.extend( nursing_bsn_chunks)
all_chunks.extend(rn_bsn_chunks)











