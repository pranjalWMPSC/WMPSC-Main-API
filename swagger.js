const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'WMPSC API',
        version: '1.0.0',
        description: 'API documentation for WMPSC project',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            basicAuth: {
                type: 'http',
                scheme: 'basic',
                description: 'Enter your credentials'
            }
        },
        schemas: {
            Candidate: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Candidate ID',
                    },
                    name: {
                        type: 'string',
                        description: 'Candidate name',
                    },
                    email: {
                        type: 'string',
                        description: 'Candidate email',
                    },
                    phone: {
                        type: 'string',
                        description: 'Candidate phone number',
                    },
                    address: {
                        type: 'string',
                        description: 'Candidate address',
                    },
                    education: {
                        type: 'string',
                        description: 'Candidate education',
                    },
                    experience: {
                        type: 'string',
                        description: 'Candidate experience',
                    },
                    skills: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Candidate skills',
                    },
                    resume: {
                        type: 'string',
                        description: 'Candidate resume URL',
                    },
                    status: {
                        type: 'string',
                        description: 'Candidate status',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation date',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last update date',
                    },
                    // Add other properties as needed
                },
            },
            Assessment: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Assessment ID',
                    },
                    name: {
                        type: 'string',
                        description: 'Assessment name',
                    },
                    time: {
                        type: 'string',
                        description: 'Assessment time',
                    },
                    date: {
                        type: 'string',
                        description: 'Assessment date',
                    },
                    subject: {
                        type: 'string',
                        description: 'Assessment subject',
                    },
                    metadata: {
                        type: 'object',
                        description: 'Assessment metadata',
                    },
                    numberOfQuestions: {
                        type: 'number',
                        description: 'Number of questions in the assessment',
                    },
                    difficulty: {
                        type: 'object',
                        properties: {
                            easy: {
                                type: 'number',
                                description: 'Number of easy questions',
                            },
                            medium: {
                                type: 'number',
                                description: 'Number of medium questions',
                            },
                            hard: {
                                type: 'number',
                                description: 'Number of hard questions',
                            },
                        },
                    },
                    // Add other properties as needed
                },
            },
            Question: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Question ID',
                    },
                    text: {
                        type: 'string',
                        description: 'Question text',
                    },
                    options: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Question options',
                    },
                    difficulty: {
                        type: 'string',
                        description: 'Question difficulty',
                    },
                    marks: {
                        type: 'number',
                        description: 'Question marks',
                    },
                    correctAnswer: {
                        type: 'string',
                        description: 'Correct answer for the question',
                    },
                    // Add other properties as needed
                },
            },
            Image: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Image ID',
                    },
                    url: {
                        type: 'string',
                        description: 'Image URL',
                    },
                    description: {
                        type: 'string',
                        description: 'Image description',
                    },
                    // Add other properties as needed
                },
            },
            TP: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'TP ID',
                    },
                    name: {
                        type: 'string',
                        description: 'TP name',
                    },
                    email: {
                        type: 'string',
                        description: 'TP email',
                    },
                    password: {
                        type: 'string',
                        description: 'TP password',
                    },
                    spocName: {
                        type: 'string',
                        description: 'TP SPOC name',
                    },
                    mobileNumber: {
                        type: 'string',
                        description: 'TP mobile number',
                    },
                    status: {
                        type: 'string',
                        description: 'TP status',
                    },
                    // Add other properties as needed
                },
            },
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'User ID',
                    },
                    username: {
                        type: 'string',
                        description: 'Username',
                    },
                    email: {
                        type: 'string',
                        description: 'User email',
                    },
                    password: {
                        type: 'string',
                        description: 'User password',
                    },
                    // Add other properties as needed
                },
            },
        },
    },
    security: [{
        basicAuth: []
    }]
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: flex }',
    customSiteTitle: 'WMPSC API Docs',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        persistAuthorization: true
    }
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Export swaggerSpec and options
module.exports = { 
    specs: swaggerSpec,
    swaggerUiOptions 
};