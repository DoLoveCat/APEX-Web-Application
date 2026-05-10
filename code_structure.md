```APEX-Web-Application/
│
├── frontend/
│   ├── picture/                        ← Static images & assets
│   │
│   ├── shared/                         ← Reusable across all pages
│   │   ├── navbar.html                 ← Navbar HTML template
│   │   ├── navbar.js                   ← injectNavbar() function
│   │   ├── footer.html                 ← Footer template
│   │   ├── api.js                      ← All fetch() calls to backend
│   │   ├── auth.js                     ← Login state, token helpers
│   │   ├── utils.js                    ← Helper functions
│   │   └── shared.css                  ← Shared styles + CSS variables
│   │
│   ├── home.html                       ← Landing page
│   ├── home.css
│   ├── home.js
│   │
│   ├── courses.html                    ← Browse all courses
│   ├── courses.css
│   ├── courses.js
│   │
│   ├── course-detail.html              ← Single course + reviews
│   ├── course-detail.css
│   ├── course-detail.js
│   │
│   ├── network.html                    ← Social feed + suggested connections
│   ├── network.css
│   ├── network.js
│   │
│   ├── mypath.html                     ← AI career advisor results
│   ├── mypath.css
│   ├── mypath.js
│   │
│   ├── login.html                      ← Login page
│   ├── login.css
│   ├── login.js
│   │
│   ├── signup.html                     ← Signup page
│   ├── signup.css
│   ├── signup.js
│   │
│   ├── profile.html                    ← User profile (view + edit)
│   ├── profile.css
│   ├── profile.js
│   │
│   ├── admin.html                      ← Admin panel
│   ├── admin.css
│   └── admin.js
│
├── backend/
│   ├── server.js                       ← Express app entry point
│   │
│   ├── config/
│   │   ├── database.js                 ← MongoDB connection
│   │   └── passport.js                 ← Google OAuth config
│   │
│   ├── models/                         ← Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Review.js
│   │   ├── Connection.js
│   │   └── Post.js
│   │
│   ├── routes/                         ← API endpoints
│   │   ├── auth.routes.js              ← /api/auth/*
│   │   ├── users.routes.js             ← /api/users/*
│   │   ├── courses.routes.js           ← /api/courses/*
│   │   ├── reviews.routes.js           ← /api/reviews/*
│   │   ├── network.routes.js           ← /api/network/*
│   │   ├── ai.routes.js                ← /api/ai/*
│   │   └── admin.routes.js             ← /api/admin/*
│   │
│   ├── controllers/                    ← Business logic
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── courses.controller.js
│   │   ├── reviews.controller.js
│   │   ├── network.controller.js
│   │   ├── ai.controller.js
│   │   └── admin.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js          ← Verify logged-in users
│   │   ├── role.middleware.js          ← Role-based access (student/mentor/admin)
│   │   ├── csrf.middleware.js          ← CSRF protection
│   │   └── sanitize.middleware.js      ← Input sanitization
│   │
│   ├── services/                       ← External integrations
│   │   ├── ai.service.js               ← Claude/OpenAI API calls
│   │   └── matching.service.js         ← Auto-match algorithm for network
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   └── seed/
│       ├── seed.js                     ← Populate database
│       └── ucr-courses.json            ← UCR course data
│
├── .env                                ← Secrets (NEVER commit)
├── .env.example                        ← Template for teammates
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── code_structure.md
```