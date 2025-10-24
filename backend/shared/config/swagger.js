const swaggerJSDoc = require('swagger-jsdoc');

/**
 * Shared Swagger Configuration
 * Base configuration for all services
 */
class SwaggerConfig {
  constructor(serviceInfo) {
    this.serviceInfo = serviceInfo;
  }

  /**
   * Get base OpenAPI configuration
   */
  getBaseConfig() {
    return {
      openapi: '3.0.0',
      info: {
        title: this.serviceInfo.title,
        version: this.serviceInfo.version,
        description: this.serviceInfo.description,
        contact: {
          name: 'Task Management System',
          email: 'support@taskmanagement.com'
        }
      },
      servers: [
        {
          url: this.serviceInfo.url,
          description: this.serviceInfo.description
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          // Common schemas
          Error: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false
              },
              message: {
                type: 'string',
                description: 'Error message'
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Error timestamp'
              }
            }
          },
          ValidationError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false
              },
              message: {
                type: 'string',
                example: 'Validation failed'
              },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: {
                      type: 'string',
                      description: 'Field name'
                    },
                    message: {
                      type: 'string',
                      description: 'Validation message'
                    }
                  }
                }
              },
              timestamp: {
                type: 'string',
                format: 'date-time'
              }
            }
          },
          SuccessResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: true
              },
              message: {
                type: 'string',
                description: 'Success message'
              },
              data: {
                type: 'object',
                description: 'Response data'
              },
              timestamp: {
                type: 'string',
                format: 'date-time'
              }
            }
          },
          PaginationResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: true
              },
              message: {
                type: 'string',
                example: 'Success'
              },
              data: {
                type: 'array',
                items: {
                  type: 'object'
                }
              },
              pagination: {
                type: 'object',
                properties: {
                  currentPage: {
                    type: 'integer',
                    example: 1
                  },
                  totalPages: {
                    type: 'integer',
                    example: 5
                  },
                  totalItems: {
                    type: 'integer',
                    example: 50
                  },
                  hasNext: {
                    type: 'boolean',
                    example: true
                  },
                  hasPrev: {
                    type: 'boolean',
                    example: false
                  },
                  limit: {
                    type: 'integer',
                    example: 10
                  }
                }
              },
              timestamp: {
                type: 'string',
                format: 'date-time'
              }
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    };
  }

  /**
   * Create service-specific swagger configuration
   */
  createConfig(serviceSchemas = {}) {
    const baseConfig = this.getBaseConfig();
    
    // Merge service-specific schemas
    if (Object.keys(serviceSchemas).length > 0) {
      baseConfig.components.schemas = {
        ...baseConfig.components.schemas,
        ...serviceSchemas
      };
    }

    return {
      definition: baseConfig,
      apis: ['./routes/*.js']
    };
  }

  /**
   * Generate swagger specs
   */
  generateSpecs(serviceSchemas = {}) {
    const config = this.createConfig(serviceSchemas);
    return swaggerJSDoc(config);
  }
}

/**
 * Factory function to create swagger config for different services
 */
const createSwaggerConfig = (serviceInfo) => {
  return new SwaggerConfig(serviceInfo);
};

module.exports = {
  SwaggerConfig,
  createSwaggerConfig
};
