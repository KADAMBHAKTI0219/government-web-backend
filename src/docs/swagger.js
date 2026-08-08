import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Chhattisgarh State Creator & Influencer Awards Portal API',
    version: '1.0.0',
    description:
      'Official Government REST API Documentation for Chhattisgarh State Creator & Influencer Awards Portal. Built using Node.js, Express.js (ES Modules), MongoDB Atlas, Mongoose, JWT Authentication, and MVC+Service+Repository pattern.'
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your JWT Access Token in the format: Bearer <token>'
      }
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
          errors: { type: 'array', items: { type: 'object' } },
          statusCode: { type: 'integer', example: 200 }
        }
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '660f1b2c45e89a0012345678' },
          name: { type: 'string', example: 'Ramesh Kumar' },
          email: { type: 'string', example: 'creator@gmail.com' },
          phone: { type: 'string', example: '9876543210' },
          role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'JURY', 'CREATOR', 'PUBLIC_USER'], example: 'CREATOR' },
          profileImage: { type: 'string', example: 'https://cloudinary.com/user_avatar.jpg' },
          bio: { type: 'string', example: 'Digital storyteller and vlog creator from Raipur.' },
          gender: { type: 'string', example: 'Male' },
          district: { type: 'string', example: 'Raipur' },
          state: { type: 'string', example: 'Chhattisgarh' },
          socialLinks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                platform: { type: 'string', example: 'youtube' },
                url: { type: 'string', example: 'https://youtube.com/@cgcreator' },
                followerCount: { type: 'number', example: 50000 },
                handle: { type: 'string', example: '@cgcreator' }
              }
            }
          },
          portfolioUrl: { type: 'string', example: 'https://youtube.com/@cgcreator' },
          isEmailVerified: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true }
        }
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '660f1b2c45e89a0012345679' },
          title: { type: 'string', example: 'Chhattisgarhiya Sanskriti Ambassador' },
          slug: { type: 'string', example: 'chhattisgarhiya-sanskriti-ambassador' },
          tier: { type: 'string', enum: ['A_CULTURE_IDENTITY', 'B_NATION_STATE_BUILDING', 'C_CRAFT_PLATFORM'], example: 'A_CULTURE_IDENTITY' },
          shortDescription: { type: 'string', example: 'Celebrating creators showcasing regional heritage.' },
          taskBrief: { type: 'string', example: 'Create an engaging video highlighting traditional folk art.' },
          hashtag: { type: 'string', example: '#ChhattisgarhiyaSanskriti' },
          prizeTier: { type: 'string', enum: ['FLAGSHIP', 'MARQUEE', 'STANDARD'], example: 'FLAGSHIP' },
          cashPrizeMin: { type: 'number', example: 50000 },
          cashPrizeMax: { type: 'number', example: 500000 },
          isActive: { type: 'boolean', example: true },
          isFeatured: { type: 'boolean', example: true }
        }
      },
      Application: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '660f1b2c45e89a0087654321' },
          applicationId: { type: 'string', example: 'APP-CG-2026-X8F9' },
          creator: { type: 'string', example: '660f1b2c45e89a0012345678' },
          category: { type: 'string', example: '660f1b2c45e89a0012345679' },
          title: { type: 'string', example: 'Bastariya Folk Art Documentary' },
          workSummary: { type: 'string', example: '3-part series showcasing traditional dhokra art.' },
          contentUrl: { type: 'string', example: 'https://youtube.com/watch?v=sample' },
          district: { type: 'string', example: 'Bastar' },
          status: { type: 'string', enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'APPROVED', 'REJECTED', 'WINNER'], example: 'SUBMITTED' },
          mediaFiles: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fileUrl: { type: 'string', example: 'https://cloudinary.com/doc.pdf' },
                fileType: { type: 'string', example: 'document' }
              }
            }
          }
        }
      },
      JuryScore: {
        type: 'object',
        properties: {
          jury: { type: 'string', example: '660f1b2c45e89a0012345688' },
          application: { type: 'string', example: '660f1b2c45e89a0087654321' },
          scores: {
            type: 'object',
            properties: {
              creativity: { type: 'number', example: 24 },
              socialImpact: { type: 'number', example: 25 },
              technicalQuality: { type: 'number', example: 22 },
              culturalRelevance: { type: 'number', example: 24 }
            }
          },
          totalScore: { type: 'number', example: 95 },
          recommendation: { type: 'string', enum: ['APPROVE', 'REJECT', 'SHORTLIST'], example: 'APPROVE' },
          remarks: { type: 'string', example: 'Outstanding cultural video quality.' }
        }
      },
      Vote: {
        type: 'object',
        properties: {
          application: { type: 'string', example: '660f1b2c45e89a0087654321' },
          category: { type: 'string', example: '660f1b2c45e89a0012345679' },
          fingerprintHash: { type: 'string', example: 'hash_abc123' },
          voterEmail: { type: 'string', example: 'voter@gmail.com' }
        }
      },
      Notification: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '660f1b2c45e89a0099999999' },
          recipient: { type: 'string', example: '660f1b2c45e89a0012345678' },
          title: { type: 'string', example: 'Application Submitted' },
          message: { type: 'string', example: 'Your nomination has been successfully submitted.' },
          type: { type: 'string', enum: ['SYSTEM', 'EMAIL', 'DASHBOARD', 'ANNOUNCEMENT', 'APPLICATION_UPDATE'], example: 'DASHBOARD' },
          isRead: { type: 'boolean', example: false },
          isBroadcast: { type: 'boolean', example: false }
        }
      },
      News: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '660f1b2c45e89a0077777777' },
          title: { type: 'string', example: 'Chhattisgarh Creator Awards 2026 Announced' },
          slug: { type: 'string', example: 'chhattisgarh-creator-awards-2026-announced' },
          summary: { type: 'string', example: 'Honble CM launches state digital awards.' },
          content: { type: 'string', example: 'Full article body content.' },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], example: 'PUBLISHED' },
          isFeatured: { type: 'boolean', example: true }
        }
      },
      Gallery: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '660f1b2c45e89a0066666666' },
          albumName: { type: 'string', example: 'Launch Event 2026' },
          slug: { type: 'string', example: 'launch-event-2026' },
          description: { type: 'string', example: 'Official photo gallery of launch ceremony.' },
          media: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                mediaUrl: { type: 'string', example: 'https://cloudinary.com/photo.jpg' },
                mediaType: { type: 'string', enum: ['photo', 'video'], example: 'photo' }
              }
            }
          }
        }
      },
      CMS: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'hero' },
          title: { type: 'string', example: 'Chhattisgarh State Creator Awards' },
          subtitle: { type: 'string', example: 'Celebrating Digital Excellence' },
          content: { type: 'object' }
        }
      },
      Certificate: {
        type: 'object',
        properties: {
          certificateId: { type: 'string', example: 'CERT-CG-2026-A1B2' },
          application: { type: 'string', example: '660f1b2c45e89a0087654321' },
          awardTitle: { type: 'string', example: 'State Ambassador Award 2026' },
          pdfUrl: { type: 'string', example: 'https://cloudinary.com/cert.pdf' },
          qrCodeUrl: { type: 'string', example: 'https://cloudinary.com/qr.png' },
          verificationHash: { type: 'string', example: 'sha256_hash_str' }
        }
      },
      ContactQuery: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '660f1b2c45e89a0055555555' },
          name: { type: 'string', example: 'Suresh Patel' },
          email: { type: 'string', example: 'suresh@example.com' },
          subject: { type: 'string', example: 'Document upload query' },
          message: { type: 'string', example: 'Can I upload video files directly?' },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], example: 'PENDING' }
        }
      }
    }
  },
  tags: [
    { name: 'Authentication', description: 'User & Admin Login, Registration, Passwords' },
    { name: 'Users & Creators', description: 'Profiles, Avatars, Social Handles & Creator Metrics' },
    { name: 'Categories', description: 'Award Category & Tier Operations' },
    { name: 'Applications', description: 'Nomination Applications, Media Uploads & Status Updates' },
    { name: 'Jury', description: 'Jury Evaluation, Scoring & Leaderboards' },
    { name: 'Voting', description: 'Public Voting System & Anti-bot Protection' },
    { name: 'Notifications', description: 'User System Notifications & Admin Broadcasts' },
    { name: 'News', description: 'Press Releases & Platform News Articles' },
    { name: 'Gallery', description: 'Photo & Video Gallery Album Management' },
    { name: 'CMS', description: 'Dynamic CMS Sections (Hero, About, FAQ, Timeline)' },
    { name: 'Certificates', description: 'PDF Certificate Generation & QR Verification' },
    { name: 'Dashboard & Reports', description: 'Admin Statistics & Data Exports (Excel/CSV)' },
    { name: 'Contact & Support', description: 'Public Inquiries & Helpdesk Queries' },
    { name: 'reCAPTCHA', description: 'Google reCAPTCHA Verification' }
  ],
  paths: {
    // ----------------------------------------------------
    // 1. AUTHENTICATION
    // ----------------------------------------------------
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new Creator account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'phone', 'password', 'district'],
                properties: {
                  name: { type: 'string', example: 'Ramesh Kumar' },
                  email: { type: 'string', example: 'creator@gmail.com' },
                  phone: { type: 'string', example: '9876543210' },
                  password: { type: 'string', example: 'password123' },
                  district: { type: 'string', example: 'Raipur' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Registration successful' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login User or Admin and obtain JWT Tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@gmail.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Login successful. Returns Access & Refresh JWT Tokens.' }
        }
      }
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh Access Token using Refresh Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'New JWT access token generated' }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout and revoke refresh token',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Logged out successfully' }
        }
      }
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request Password Reset Link via Email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', example: 'creator@gmail.com' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Password reset link sent to email' }
        }
      }
    },
    '/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset Password with Reset Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string', example: '3f8a91b...' },
                  newPassword: { type: 'string', example: 'newpassword123' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Password reset successfully' }
        }
      }
    },
    '/auth/change-password': {
      put: {
        tags: ['Authentication'],
        summary: 'Change Logged-in User Password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'password123' },
                  newPassword: { type: 'string', example: 'newpassword123' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Password changed successfully' }
        }
      }
    },

    // ----------------------------------------------------
    // 2. USERS & CREATORS
    // ----------------------------------------------------
    '/users/profile': {
      get: {
        tags: ['Users & Creators'],
        summary: 'Get Logged-in User Profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile object returned' }
        }
      },
      put: {
        tags: ['Users & Creators'],
        summary: 'Update Logged-in User Profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Ramesh Kumar' },
                  bio: { type: 'string', example: 'Digital storyteller from Raipur' },
                  district: { type: 'string', example: 'Raipur' },
                  gender: { type: 'string', example: 'Male' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Profile updated successfully' }
        }
      }
    },
    '/users/profile-image': {
      post: {
        tags: ['Users & Creators'],
        summary: 'Upload User Avatar / Profile Image',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Profile image uploaded' }
        }
      }
    },
    '/users/account': {
      delete: {
        tags: ['Users & Creators'],
        summary: 'Delete Logged-in User Account',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Account deleted' }
        }
      }
    },
    '/users/all': {
      get: {
        tags: ['Users & Creators'],
        summary: 'Get All Platform Users (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'role', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': { description: 'Paginated user list' }
        }
      }
    },
    '/creators/dashboard': {
      get: {
        tags: ['Users & Creators'],
        summary: 'Get Creator Dashboard Statistics & Status',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Creator metrics returned' }
        }
      }
    },
    '/creators/social-links': {
      put: {
        tags: ['Users & Creators'],
        summary: 'Update Creator Social Media Handles',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  socialLinks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        platform: { type: 'string', example: 'youtube' },
                        url: { type: 'string', example: 'https://youtube.com/@cgcreator' },
                        followerCount: { type: 'number', example: 50000 },
                        handle: { type: 'string', example: '@cgcreator' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Social links updated' }
        }
      }
    },
    '/creators/achievements': {
      put: {
        tags: ['Users & Creators'],
        summary: 'Update Creator Achievements & Awards History',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  achievements: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string', example: 'Best Regional Storyteller 2025' },
                        organization: { type: 'string', example: 'Culture Fest' },
                        year: { type: 'number', example: 2025 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Achievements updated' }
        }
      }
    },
    '/creators/portfolio': {
      post: {
        tags: ['Users & Creators'],
        summary: 'Upload Creator Portfolio File',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  portfolio: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Portfolio uploaded' }
        }
      }
    },

    // ----------------------------------------------------
    // 3. CATEGORIES
    // ----------------------------------------------------
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get All Award Categories (Public)',
        responses: {
          '200': { description: 'List of award categories' }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Create New Award Category (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'tier', 'shortDescription', 'taskBrief'],
                properties: {
                  title: { type: 'string', example: 'Tourism & Heritage Storyteller' },
                  tier: { type: 'string', example: 'A_CULTURE_IDENTITY' },
                  shortDescription: { type: 'string', example: 'Spotlighting travel vloggers showcasing Chhattisgarh.' },
                  taskBrief: { type: 'string', example: 'Produce a video showcasing hidden eco-tourism sites.' },
                  prizeTier: { type: 'string', example: 'FLAGSHIP' },
                  cashPrizeMin: { type: 'number', example: 50000 },
                  cashPrizeMax: { type: 'number', example: 500000 }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Category created' }
        }
      }
    },
    '/categories/{slug}': {
      get: {
        tags: ['Categories'],
        summary: 'Get Category Details by Slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Category details returned' }
        }
      }
    },
    '/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Update Category (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  shortDescription: { type: 'string' },
                  isFeatured: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Category updated' }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete Category (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Category deleted' }
        }
      }
    },

    // ----------------------------------------------------
    // 4. APPLICATIONS
    // ----------------------------------------------------
    '/applications': {
      get: {
        tags: ['Applications'],
        summary: 'Get Applications (Filtered by status, category, district)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': { description: 'Filtered applications returned' }
        }
      },
      post: {
        tags: ['Applications'],
        summary: 'Create Nomination Application Draft',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['category', 'title', 'workSummary', 'contentUrl', 'district'],
                properties: {
                  category: { type: 'string', example: '660f1b2c45e89a0012345679' },
                  title: { type: 'string', example: 'Bastariya Folk Art Series' },
                  workSummary: { type: 'string', example: 'A 3-part documentary on tribal crafts.' },
                  contentUrl: { type: 'string', example: 'https://youtube.com/watch?v=sample' },
                  district: { type: 'string', example: 'Bastar' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Draft application created' }
        }
      }
    },
    '/applications/{id}': {
      get: {
        tags: ['Applications'],
        summary: 'Get Application Details by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Application details returned' }
        }
      }
    },
    '/applications/{id}/submit': {
      post: {
        tags: ['Applications'],
        summary: 'Submit Application for Review',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Application status changed to SUBMITTED' }
        }
      }
    },
    '/applications/{id}/draft': {
      put: {
        tags: ['Applications'],
        summary: 'Update Nomination Draft Details',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Draft updated' }
        }
      },
      delete: {
        tags: ['Applications'],
        summary: 'Delete Nomination Draft',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Draft deleted' }
        }
      }
    },
    '/applications/{id}/upload': {
      post: {
        tags: ['Applications'],
        summary: 'Upload Attachment to Nomination Application',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'File uploaded and attached to application' }
        }
      }
    },
    '/applications/{id}/status': {
      put: {
        tags: ['Applications'],
        summary: 'Update Application Status (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['SHORTLISTED', 'APPROVED', 'REJECTED', 'WINNER'], example: 'SHORTLISTED' },
                  remarks: { type: 'string', example: 'Selected for final jury round.' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Application status updated' }
        }
      }
    },

    // ----------------------------------------------------
    // 5. JURY
    // ----------------------------------------------------
    '/jury/assign': {
      post: {
        tags: ['Jury'],
        summary: 'Assign Jury Member to Application (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['juryId', 'applicationId'],
                properties: {
                  juryId: { type: 'string', example: '660f1b2c45e89a0012345688' },
                  applicationId: { type: 'string', example: '660f1b2c45e89a0087654321' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Jury assigned successfully' }
        }
      }
    },
    '/jury/assigned': {
      get: {
        tags: ['Jury'],
        summary: 'Get Assigned Applications for Logged-in Jury',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of assigned applications' }
        }
      }
    },
    '/jury/score/{applicationId}': {
      post: {
        tags: ['Jury'],
        summary: 'Submit Jury Evaluation Scores',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'applicationId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['scores'],
                properties: {
                  scores: {
                    type: 'object',
                    properties: {
                      creativity: { type: 'number', example: 24 },
                      socialImpact: { type: 'number', example: 25 },
                      technicalQuality: { type: 'number', example: 22 },
                      culturalRelevance: { type: 'number', example: 24 }
                    }
                  },
                  recommendation: { type: 'string', example: 'APPROVE' },
                  remarks: { type: 'string', example: 'High production quality.' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Scores submitted' }
        }
      }
    },
    '/jury/leaderboard': {
      get: {
        tags: ['Jury'],
        summary: 'Get Jury Scores Leaderboard',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Jury leaderboard returned' }
        }
      }
    },

    // ----------------------------------------------------
    // 6. VOTING
    // ----------------------------------------------------
    '/voting/cast': {
      post: {
        tags: ['Voting'],
        summary: 'Cast Public Vote for Application',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['applicationId', 'fingerprint'],
                properties: {
                  applicationId: { type: 'string', example: '660f1b2c45e89a0087654321' },
                  fingerprint: { type: 'string', example: 'device_hash_12345' },
                  voterEmail: { type: 'string', example: 'voter@gmail.com' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Vote recorded' }
        }
      }
    },
    '/voting/analytics': {
      get: {
        tags: ['Voting'],
        summary: 'Get Voting Leaderboard & Analytics',
        responses: {
          '200': { description: 'Public voting analytics returned' }
        }
      }
    },

    // ----------------------------------------------------
    // 7. NOTIFICATIONS
    // ----------------------------------------------------
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get User Notifications',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User notifications returned' }
        }
      }
    },
    '/notifications/{id}/read': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark Notification as Read',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Notification marked read' }
        }
      }
    },
    '/notifications/broadcast': {
      post: {
        tags: ['Notifications'],
        summary: 'Broadcast Announcement (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'message'],
                properties: {
                  title: { type: 'string', example: 'Deadline Extended!' },
                  message: { type: 'string', example: 'Submissions open till month end.' },
                  link: { type: 'string', example: '/timeline' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Broadcast sent' }
        }
      }
    },

    // ----------------------------------------------------
    // 8. NEWS
    // ----------------------------------------------------
    '/news': {
      get: {
        tags: ['News'],
        summary: 'Get All Published News Articles (Public)',
        responses: {
          '200': { description: 'List of news articles' }
        }
      },
      post: {
        tags: ['News'],
        summary: 'Create News Article (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'summary', 'content'],
                properties: {
                  title: { type: 'string', example: 'Chhattisgarh Creator Awards Launch' },
                  summary: { type: 'string', example: 'Honble CM launches state portal.' },
                  content: { type: 'string', example: 'Full article body.' },
                  isFeatured: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'News created' }
        }
      }
    },
    '/news/{slug}': {
      get: {
        tags: ['News'],
        summary: 'Get News Article by Slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'News article details' }
        }
      }
    },
    '/news/{id}': {
      put: {
        tags: ['News'],
        summary: 'Update News Article (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'News updated' }
        }
      },
      delete: {
        tags: ['News'],
        summary: 'Delete News Article (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'News deleted' }
        }
      }
    },

    // ----------------------------------------------------
    // 9. GALLERY
    // ----------------------------------------------------
    '/gallery': {
      get: {
        tags: ['Gallery'],
        summary: 'Get Gallery Albums & Items (Public)',
        responses: {
          '200': { description: 'Gallery albums returned' }
        }
      },
      post: {
        tags: ['Gallery'],
        summary: 'Create Gallery Album (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['albumName'],
                properties: {
                  albumName: { type: 'string', example: 'Launch Event 2026' },
                  description: { type: 'string', example: 'Launch ceremony photos' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Gallery album created' }
        }
      }
    },
    '/gallery/{slug}': {
      get: {
        tags: ['Gallery'],
        summary: 'Get Gallery Album by Slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Album details returned' }
        }
      }
    },
    '/gallery/{id}/media': {
      post: {
        tags: ['Gallery'],
        summary: 'Add Media Items to Album (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Media added' }
        }
      }
    },

    // ----------------------------------------------------
    // 10. CMS MANAGEMENT
    // ----------------------------------------------------
    '/cms/all': {
      get: {
        tags: ['CMS'],
        summary: 'Get All CMS Sections',
        responses: {
          '200': { description: 'All CMS sections object' }
        }
      }
    },
    '/cms/{key}': {
      get: {
        tags: ['CMS'],
        summary: 'Get CMS Section Content by Key',
        parameters: [
          { name: 'key', in: 'path', required: true, schema: { type: 'string' }, example: 'hero' }
        ],
        responses: {
          '200': { description: 'Section content returned' }
        }
      },
      put: {
        tags: ['CMS'],
        summary: 'Update CMS Section Content (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'key', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Section updated' }
        }
      }
    },

    // ----------------------------------------------------
    // 11. CERTIFICATES
    // ----------------------------------------------------
    '/certificates/verify': {
      get: {
        tags: ['Certificates'],
        summary: 'Verify Certificate via QR Hash',
        parameters: [
          { name: 'hash', in: 'query', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Certificate validity status' }
        }
      }
    },
    '/certificates/my-certificates': {
      get: {
        tags: ['Certificates'],
        summary: 'Get Logged-in Creator Certificates',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Certificates list' }
        }
      }
    },
    '/certificates/generate': {
      post: {
        tags: ['Certificates'],
        summary: 'Generate Award PDF & QR Certificate (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['applicationId', 'awardTitle'],
                properties: {
                  applicationId: { type: 'string', example: '660f1b2c45e89a0087654321' },
                  awardTitle: { type: 'string', example: 'State Ambassador Award 2026' },
                  position: { type: 'string', example: '1ST_PLACE' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Certificate generated with PDF and QR code URL' }
        }
      }
    },

    // ----------------------------------------------------
    // 12. DASHBOARDS & REPORTS
    // ----------------------------------------------------
    '/dashboard/admin': {
      get: {
        tags: ['Dashboard & Reports'],
        summary: 'Get Admin System Overview Metrics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Admin statistics returned' }
        }
      }
    },
    '/dashboard/jury': {
      get: {
        tags: ['Dashboard & Reports'],
        summary: 'Get Jury Dashboard Overview Metrics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Jury statistics returned' }
        }
      }
    },
    '/reports/applications/excel': {
      get: {
        tags: ['Dashboard & Reports'],
        summary: 'Export All Applications to Excel File (.xlsx)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Excel binary file download' }
        }
      }
    },
    '/reports/applications/csv': {
      get: {
        tags: ['Dashboard & Reports'],
        summary: 'Export All Applications to CSV File',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'CSV file download' }
        }
      }
    },

    // ----------------------------------------------------
    // 13. CONTACT & SUPPORT
    // ----------------------------------------------------
    '/contact/submit': {
      post: {
        tags: ['Contact & Support'],
        summary: 'Submit Public Query / Grievance',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                  name: { type: 'string', example: 'Suresh Patel' },
                  email: { type: 'string', example: 'suresh@example.com' },
                  phone: { type: 'string', example: '9876543210' },
                  subject: { type: 'string', example: 'Upload issue' },
                  message: { type: 'string', example: 'Help with document format.' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Contact query submitted' }
        }
      }
    },
    '/contact/all': {
      get: {
        tags: ['Contact & Support'],
        summary: 'Get All Support Queries (Admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Support queries list' }
        }
      }
    },
    '/contact/{id}/resolve': {
      put: {
        tags: ['Contact & Support'],
        summary: 'Resolve Support Query (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Query status updated to RESOLVED' }
        }
      }
    },

    // ----------------------------------------------------
    // 14. CAPTCHA & RECAPTCHA VERIFICATION
    // ----------------------------------------------------
    '/captcha/generate': {
      get: {
        tags: ['reCAPTCHA'],
        summary: 'Generate visual SVG CAPTCHA',
        parameters: [
          { name: 'width', in: 'query', schema: { type: 'integer', example: 160 }, description: 'Width of SVG image' },
          { name: 'height', in: 'query', schema: { type: 'integer', example: 60 }, description: 'Height of SVG image' },
          { name: 'size', in: 'query', schema: { type: 'integer', example: 6 }, description: 'Number of characters' }
        ],
        responses: {
          '200': {
            description: 'Captcha generated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Captcha generated successfully.' },
                    data: {
                      type: 'object',
                      properties: {
                        captchaId: { type: 'string', example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' },
                        captchaSvg: { type: 'string', example: '<svg xmlns=...</svg>' },
                        captchaImage: { type: 'string', example: 'data:image/svg+xml;base64,...' },
                        expiresAt: { type: 'string', example: '2026-08-08T11:00:00.000Z' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/captcha/verify': {
      post: {
        tags: ['reCAPTCHA'],
        summary: 'Verify SVG CAPTCHA code or Google reCAPTCHA Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  captchaId: { type: 'string', example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' },
                  captchaText: { type: 'string', example: 'ab3xyz' },
                  captchaToken: { type: 'string', example: '03AFcWeA7...' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Captcha verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Captcha verified successfully.' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Verification failed or incorrect captcha',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Incorrect CAPTCHA answer. Please try again.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/recaptcha/verify': {
      post: {
        tags: ['reCAPTCHA'],
        summary: 'Verify Google reCAPTCHA v2 Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['captchaToken'],
                properties: {
                  captchaToken: { type: 'string', example: '03AFcWeA7...' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Captcha verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Captcha verified successfully.' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Verification failed or missing token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Please complete the CAPTCHA.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    // ----------------------------------------------------
    // 15. PARTICIPANTS MANAGEMENT
    // ----------------------------------------------------
    '/participants/register': {
      post: {
        tags: ['Participants'],
        summary: 'Register a new Participant / Nomination',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'phone', 'district', 'category', 'workSummary', 'contentUrl'],
                properties: {
                  name: { type: 'string', example: 'Ramesh Kumar' },
                  phone: { type: 'string', example: '9876543210' },
                  email: { type: 'string', example: 'ramesh@example.com' },
                  district: { type: 'string', example: 'Raipur' },
                  category: { type: 'string', example: 'Digital Empowerment' },
                  workSummary: { type: 'string', example: 'Creating digital education content' },
                  contentUrl: { type: 'string', example: 'https://youtube.com/watch?v=123' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Participant registered successfully' }
        }
      }
    },
    '/participants': {
      get: {
        tags: ['Participants'],
        summary: 'Get all participants (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Participants list retrieved successfully' }
        }
      }
    },
    '/participants/{id}': {
      get: {
        tags: ['Participants'],
        summary: 'Get participant by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Participant details retrieved' } }
      },
      put: {
        tags: ['Participants'],
        summary: 'Update participant by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Participant updated successfully' } }
      },
      delete: {
        tags: ['Participants'],
        summary: 'Delete participant by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Participant deleted successfully' } }
      }
    }
  }
};

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerDocument);
