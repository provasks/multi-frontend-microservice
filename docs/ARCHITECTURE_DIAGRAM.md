# Task Management System - Complete Architecture Diagram

## 🏗️ System Overview

This document contains comprehensive architecture diagrams for the Task Management System, showing the complete microfrontend and microservices architecture.

## 📊 Complete System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        U[User Browser]
    end
    
    subgraph "Frontend Layer - Microfrontends"
        subgraph "Shell Application (Port 4000)"
            SA[Shell App<br/>React Router<br/>Authentication<br/>Global State]
        end
        
        subgraph "Microfrontends"
            UA[User App<br/>Port 4001<br/>User Management]
            TA[Task App<br/>Port 4002<br/>Task Management]
            NA[Notification App<br/>Port 4003<br/>Notifications]
        end
        
        subgraph "Shared Components (Port 4004)"
            SC[Shared Components<br/>UI Components<br/>Redux Store<br/>API Client<br/>Idle Timeout]
        end
    end
    
    subgraph "Backend Layer - Microservices"
        subgraph "API Gateway (Port 3000)"
            AG[API Gateway<br/>Rate Limiting<br/>CORS<br/>Request Routing]
        end
        
        subgraph "Backend Services"
            US[User Service<br/>Port 3001<br/>Authentication<br/>User Management]
            TS[Task Service<br/>Port 3002<br/>Task CRUD<br/>Task Operations]
            NS[Notification Service<br/>Port 3003<br/>Notifications<br/>Alerts]
        end
        
        subgraph "Shared Backend Components"
            SM[Security Middleware<br/>Error Handling<br/>Logging<br/>Monitoring]
        end
    end
    
    subgraph "Data Layer"
        DB[(MongoDB<br/>Port 27017<br/>User Data<br/>Task Data<br/>Notification Data)]
    end
    
    %% Client to Frontend
    U --> SA
    
    %% Frontend Internal Communication
    SA --> UA
    SA --> TA
    SA --> NA
    SC --> SA
    SC --> UA
    SC --> TA
    SC --> NA
    
    %% Frontend to Backend
    SA --> AG
    UA --> AG
    TA --> AG
    NA --> AG
    
    %% Backend Internal Communication
    AG --> US
    AG --> TS
    AG --> NS
    SM --> US
    SM --> TS
    SM --> NS
    
    %% Backend to Database
    US --> DB
    TS --> DB
    NS --> DB
    
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef database fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef shared fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class SA,UA,TA,NA,SC frontend
    class AG,US,TS,NS,SM backend
    class DB database
    class SC,SM shared
```

## 🔄 Frontend Microfrontend Architecture

```mermaid
graph TB
    subgraph "Webpack Module Federation"
        subgraph "Shell App (Host - Port 4000)"
            SA[Shell Application<br/>React Router<br/>Authentication<br/>Global Layout]
        end
        
        subgraph "Remote Applications"
            UA[User App<br/>Port 4001<br/>Remote Entry]
            TA[Task App<br/>Port 4002<br/>Remote Entry]
            NA[Notification App<br/>Port 4003<br/>Remote Entry]
        end
        
        subgraph "Shared Components (Port 4004)"
            SC[Shared Components<br/>Remote Entry<br/>UI Components<br/>Redux Store]
        end
    end
    
    subgraph "Shared Dependencies"
        R[React 18.2.0]
        RD[React DOM]
        RR[React Router v6]
        RT[Redux Toolkit]
        RRX[React Redux]
        B[Bootstrap 5.2.0]
        C[Chart.js]
    end
    
    subgraph "Frontend Features"
        D[Dashboard<br/>Charts & Analytics]
        IT[Idle Timeout<br/>Session Management]
        ST[State Management<br/>Redux Integration]
        UI[UI Components<br/>Shared Library]
    end
    
    %% Module Federation Connections
    SA -.->|Loads| UA
    SA -.->|Loads| TA
    SA -.->|Loads| NA
    SA -.->|Loads| SC
    
    %% Shared Dependencies
    SA --> R
    UA --> R
    TA --> R
    NA --> R
    SC --> R
    
    %% Features
    SA --> D
    SA --> IT
    SA --> ST
    SC --> UI
    
    %% Styling
    classDef shell fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef remote fill:#f1f8e9,stroke:#388e3c,stroke-width:2px
    classDef shared fill:#fff8e1,stroke:#f57c00,stroke-width:2px
    classDef feature fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class SA shell
    class UA,TA,NA remote
    class SC,R,RD,RR,RT,RRX,B,C shared
    class D,IT,ST,UI feature
```

## 🏢 Backend Microservices Architecture

```mermaid
graph TB
    subgraph "API Gateway Layer"
        AG[API Gateway<br/>Port 3000<br/>Request Routing<br/>Rate Limiting<br/>CORS<br/>Load Balancing]
    end
    
    subgraph "Microservices Layer"
        subgraph "User Service (Port 3001)"
            US[User Service<br/>Authentication<br/>User CRUD<br/>JWT Management<br/>Password Hashing]
        end
        
        subgraph "Task Service (Port 3002)"
            TS[Task Service<br/>Task CRUD<br/>Task Filtering<br/>Task Search<br/>Task Statistics]
        end
        
        subgraph "Notification Service (Port 3003)"
            NS[Notification Service<br/>Notification CRUD<br/>Real-time Alerts<br/>Notification History]
        end
    end
    
    subgraph "Shared Backend Infrastructure"
        subgraph "Security Layer"
            SM[Security Middleware<br/>Helmet.js<br/>Input Sanitization<br/>XSS Protection]
            RL[Rate Limiting<br/>Environment-based<br/>IP-based Limiting]
        end
        
        subgraph "Monitoring & Logging"
            EL[Error Logging<br/>Structured Logs<br/>Security Events]
            ML[Monitoring<br/>Performance Metrics<br/>Health Checks]
        end
        
        subgraph "Configuration"
            BC[Backend Config<br/>Environment Variables<br/>Service Discovery]
        end
    end
    
    subgraph "Data Layer"
        DB[(MongoDB<br/>Port 27017<br/>Collections:<br/>users, tasks, notifications)]
    end
    
    %% API Gateway to Services
    AG --> US
    AG --> TS
    AG --> NS
    
    %% Shared Infrastructure
    SM --> US
    SM --> TS
    SM --> NS
    RL --> AG
    EL --> US
    EL --> TS
    EL --> NS
    ML --> US
    ML --> TS
    ML --> NS
    BC --> US
    BC --> TS
    BC --> NS
    
    %% Services to Database
    US --> DB
    TS --> DB
    NS --> DB
    
    %% Styling
    classDef gateway fill:#e8eaf6,stroke:#3f51b5,stroke-width:3px
    classDef service fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    classDef shared fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef database fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    
    class AG gateway
    class US,TS,NS service
    class SM,RL,EL,ML,BC shared
    class DB database
```

## 🔐 Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        subgraph "Frontend Security"
            FS[Frontend Security<br/>JWT Storage<br/>Session Management<br/>Input Validation<br/>XSS Protection]
        end
        
        subgraph "API Gateway Security"
            AGS[API Gateway Security<br/>Rate Limiting<br/>CORS<br/>Request Validation<br/>IP Filtering]
        end
        
        subgraph "Service Security"
            SS[Service Security<br/>JWT Verification<br/>Input Sanitization<br/>SQL Injection Prevention<br/>Authentication Middleware]
        end
        
        subgraph "Data Security"
            DS[Data Security<br/>Password Hashing<br/>Data Encryption<br/>Access Control<br/>Audit Logging]
        end
    end
    
    subgraph "Security Components"
        JWT[JWT Authentication<br/>Token Generation<br/>Token Validation<br/>Token Refresh]
        RL[Rate Limiting<br/>IP-based Limits<br/>Endpoint-specific<br/>Environment-aware]
        VAL[Input Validation<br/>Schema Validation<br/>Sanitization<br/>XSS Prevention]
        LOG[Security Logging<br/>Audit Trails<br/>Threat Detection<br/>Incident Response]
    end
    
    %% Security Flow
    FS --> AGS
    AGS --> SS
    SS --> DS
    
    %% Security Components
    JWT --> FS
    JWT --> SS
    RL --> AGS
    VAL --> SS
    LOG --> DS
    
    %% Styling
    classDef security fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef component fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class FS,AGS,SS,DS security
    class JWT,RL,VAL,LOG component
```

## 📊 Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant SA as Shell App
    participant MA as Microfrontend App
    participant SC as Shared Components
    participant AG as API Gateway
    participant BS as Backend Service
    participant DB as MongoDB
    
    Note over U,DB: User Login Flow
    U->>SA: Login Request
    SA->>SC: Get API Client
    SC->>AG: POST /api/auth/login
    AG->>BS: Forward to User Service
    BS->>DB: Validate Credentials
    DB-->>BS: User Data
    BS-->>AG: JWT Token
    AG-->>SC: Token Response
    SC-->>SA: Login Success
    SA-->>U: Redirect to Dashboard
    
    Note over U,DB: Task Management Flow
    U->>MA: Task Operation
    MA->>SC: Get Redux Store
    SC->>AG: API Request with JWT
    AG->>BS: Forward to Task Service
    BS->>DB: Database Operation
    DB-->>BS: Result
    BS-->>AG: Response
    AG-->>SC: API Response
    SC->>SC: Update Redux State
    SC-->>MA: State Update
    MA-->>U: Updated UI
    
    Note over U,DB: Idle Timeout Flow
    U->>SA: User Activity
    SA->>SC: Activity Detection
    SC->>SC: Reset Idle Timer
    Note over SC: Timer Expires
    SC->>SA: Timeout Warning
    SA->>U: Show Warning Modal
    Note over U: User Inactive
    SC->>SC: Logout User
    SC->>SA: Clear Session
    SA->>U: Redirect to Login
```

## 🔄 State Management Architecture

```mermaid
graph TB
    subgraph "Redux Store Architecture"
        subgraph "Store Structure"
            ST[Redux Store<br/>Centralized State<br/>Time Travel Debugging<br/>Predictable Updates]
        end
        
        subgraph "Slices"
            AS[Auth Slice<br/>User Authentication<br/>Session Management<br/>Login/Logout]
            TS[Tasks Slice<br/>Task Data<br/>Task Operations<br/>Task Filtering]
            NS[Notifications Slice<br/>Notification Data<br/>Notification Operations<br/>Read/Unread Status]
            US[UI Slice<br/>UI State<br/>Loading States<br/>Error States]
            IS[Idle Timeout Slice<br/>Timeout Configuration<br/>Activity Detection<br/>Warning States]
        end
        
        subgraph "Middleware"
            SM[Storage Middleware<br/>Session Storage<br/>State Persistence<br/>Data Cleanup]
        end
        
        subgraph "Selectors"
            SEL[Reselect Selectors<br/>Computed Values<br/>Memoized Queries<br/>Performance Optimization]
        end
    end
    
    subgraph "Components Integration"
        subgraph "Hooks"
            AH[useAuth<br/>Authentication State]
            TH[useTasks<br/>Task Management]
            NH[useNotifications<br/>Notification State]
            UH[useUI<br/>UI State Management]
            IH[useIdleTimeout<br/>Timeout Management]
        end
        
        subgraph "Components"
            C[React Components<br/>Connected to Store<br/>Automatic Re-renders<br/>Optimized Updates]
        end
    end
    
    %% Store Connections
    ST --> AS
    ST --> TS
    ST --> NS
    ST --> US
    ST --> IS
    ST --> SM
    ST --> SEL
    
    %% Hooks to Store
    AH --> AS
    TH --> TS
    NH --> NS
    UH --> US
    IH --> IS
    
    %% Components to Hooks
    C --> AH
    C --> TH
    C --> NH
    C --> UH
    C --> IH
    
    %% Styling
    classDef store fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef slice fill:#f1f8e9,stroke:#388e3c,stroke-width:2px
    classDef hook fill:#fff8e1,stroke:#f57c00,stroke-width:2px
    classDef component fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class ST store
    class AS,TS,NS,US,IS,SM,SEL slice
    class AH,TH,NH,UH,IH hook
    class C component
```

## 🌐 Network Architecture

```mermaid
graph TB
    subgraph "Client Network"
        U[User Browser<br/>localhost:4000]
    end
    
    subgraph "Frontend Network (Ports 4000-4004)"
        SA[Shell App<br/>:4000]
        UA[User App<br/>:4001]
        TA[Task App<br/>:4002]
        NA[Notification App<br/>:4003]
        SC[Shared Components<br/>:4004]
    end
    
    subgraph "Backend Network (Ports 3000-3003)"
        AG[API Gateway<br/>:3000]
        US[User Service<br/>:3001]
        TS[Task Service<br/>:3002]
        NS[Notification Service<br/>:3003]
    end
    
    subgraph "Database Network"
        DB[MongoDB<br/>:27017]
    end
    
    subgraph "Development Tools"
        DT[Webpack Dev Server<br/>Hot Reloading<br/>Module Federation]
    end
    
    %% Network Connections
    U --> SA
    SA --> UA
    SA --> TA
    SA --> NA
    SA --> SC
    
    SA --> AG
    UA --> AG
    TA --> AG
    NA --> AG
    
    AG --> US
    AG --> TS
    AG --> NS
    
    US --> DB
    TS --> DB
    NS --> DB
    
    DT --> SA
    DT --> UA
    DT --> TA
    DT --> NA
    DT --> SC
    
    %% Styling
    classDef client fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef database fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef tools fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class U client
    class SA,UA,TA,NA,SC frontend
    class AG,US,TS,NS backend
    class DB database
    class DT tools
```

## 📈 Performance & Monitoring Architecture

```mermaid
graph TB
    subgraph "Performance Monitoring"
        subgraph "Frontend Monitoring"
            FM[Frontend Monitoring<br/>Bundle Analysis<br/>Performance Metrics<br/>Error Tracking<br/>User Analytics]
        end
        
        subgraph "Backend Monitoring"
            BM[Backend Monitoring<br/>API Performance<br/>Response Times<br/>Error Rates<br/>Resource Usage]
        end
        
        subgraph "Database Monitoring"
            DM[Database Monitoring<br/>Query Performance<br/>Connection Pool<br/>Index Usage<br/>Storage Metrics]
        end
    end
    
    subgraph "Logging & Analytics"
        subgraph "Structured Logging"
            SL[Structured Logs<br/>JSON Format<br/>Log Levels<br/>Correlation IDs<br/>Context Data]
        end
        
        subgraph "Security Logging"
            SEC[Security Logs<br/>Authentication Events<br/>Rate Limit Hits<br/>Security Violations<br/>Audit Trails]
        end
        
        subgraph "Performance Analytics"
            PA[Performance Analytics<br/>Response Time Trends<br/>Error Rate Analysis<br/>User Behavior<br/>System Health]
        end
    end
    
    subgraph "Health Checks"
        HC[Health Checks<br/>Service Status<br/>Dependency Checks<br/>Database Connectivity<br/>API Endpoints]
    end
    
    %% Monitoring Connections
    FM --> SL
    BM --> SL
    DM --> SL
    
    SL --> SEC
    SL --> PA
    
    HC --> FM
    HC --> BM
    HC --> DM
    
    %% Styling
    classDef monitoring fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef logging fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef health fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    
    class FM,BM,DM monitoring
    class SL,SEC,PA logging
    class HC health
```

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        subgraph "Local Development"
            LD[Local Development<br/>npm start<br/>Webpack Dev Server<br/>Hot Reloading<br/>Module Federation]
        end
        
        subgraph "Development Services"
            DS[Development Services<br/>MongoDB Local<br/>All Services Running<br/>Debug Mode<br/>Verbose Logging]
        end
    end
    
    subgraph "Production Environment"
        subgraph "Load Balancer"
            LB[Load Balancer<br/>Nginx/Apache<br/>SSL Termination<br/>Static File Serving<br/>Request Routing]
        end
        
        subgraph "Application Servers"
            AS[Application Servers<br/>Node.js Processes<br/>PM2 Process Manager<br/>Auto-restart<br/>Health Monitoring]
        end
        
        subgraph "Database Cluster"
            DC[Database Cluster<br/>MongoDB Replica Set<br/>Primary/Secondary<br/>Backup Strategy<br/>High Availability]
        end
        
        subgraph "Monitoring & Logging"
            ML[Monitoring & Logging<br/>ELK Stack<br/>Prometheus/Grafana<br/>Alert Manager<br/>Log Aggregation]
        end
    end
    
    subgraph "CI/CD Pipeline"
        CI[Continuous Integration<br/>GitHub Actions<br/>Automated Testing<br/>Code Quality Checks<br/>Security Scanning]
        CD[Continuous Deployment<br/>Automated Deployment<br/>Blue-Green Deployment<br/>Rollback Strategy<br/>Health Checks]
    end
    
    %% Development Flow
    LD --> DS
    
    %% Production Flow
    LB --> AS
    AS --> DC
    AS --> ML
    
    %% CI/CD Flow
    CI --> CD
    CD --> AS
    
    %% Styling
    classDef development fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef production fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef cicd fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    
    class LD,DS development
    class LB,AS,DC,ML production
    class CI,CD cicd
```

## 📋 Architecture Summary

### **Frontend Architecture**
- **Microfrontend Pattern**: Shell app orchestrates independent microfrontends
- **Module Federation**: Webpack 5 enables dynamic loading of remote applications
- **Shared Components**: Common UI components and utilities
- **State Management**: Redux Toolkit for centralized state management
- **Modern Stack**: React 18, Bootstrap 5, Chart.js

### **Backend Architecture**
- **Microservices Pattern**: Independent services with specific responsibilities
- **API Gateway**: Central entry point with routing and security
- **Shared Infrastructure**: Common middleware, security, and monitoring
- **Database**: MongoDB with service-specific collections
- **Security**: Multi-layer security with JWT, rate limiting, and input validation

### **Key Features**
- **Idle Timeout**: Configurable session management with Redux integration
- **Dashboard**: Interactive analytics with Chart.js visualizations
- **Rate Limiting**: Environment-aware protection against abuse
- **Error Handling**: Comprehensive error management and logging
- **Configuration**: Centralized, environment-specific configuration system

### **Development Experience**
- **Hot Reloading**: Fast development with Webpack Dev Server
- **Module Federation**: Independent development and deployment
- **Type Safety**: Consistent interfaces and validation
- **Debugging**: Comprehensive logging and monitoring tools
- **Documentation**: Extensive documentation and setup guides
