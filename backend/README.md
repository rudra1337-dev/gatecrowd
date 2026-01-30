backend/
│
├── src/
│   ├── config/         # DB & app configuration
│   │   └── db.js
│   │
│   ├── controllers/    # Business logic
│   │   └── user.controller.js
│   │
│   ├── models/         # Mongoose models
│   │   └── user.model.js
│   │
│   ├── routes/         # Express routes
│   │   └── user.routes.js
│   │
│   ├── middleware/     # Auth, error handling, etc.
│   │   └── auth.middleware.js
│   │
│   ├── services/       # Complex logic / helpers
│   │
│   ├── utils/          # Utility functions
│   │
│   └── app.js          # Express app setup
│
├── server.js           # Server entry point
├── .env
├── .gitignore
├── package.json
└── README.md










backend/
│
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── gate.controller.js
│   │   ├── feedback.controller.js
│   │   └── crowd.controller.js
│   │
│   ├── models/
│   │   ├── gate.model.js
│   │   ├── feedback.model.js
│   │   └── historical.model.js
│   │
│   ├── routes/
│   │   ├── gate.routes.js
│   │   ├── feedback.routes.js
│   │   └── crowd.routes.js
│   │
│   ├── middleware/
│   │   └── error.middleware.js
│   │
│   ├── services/
│   │   └── crowd.service.js   # Crowd calculation logic
│   │
│   ├── utils/
│   │   └── time.utils.js
│   │
│   └── app.js                 # Express app config
│
├── server.js                  # Entry point
├── .env
├── .gitignore
├── package.json
└── README.md
