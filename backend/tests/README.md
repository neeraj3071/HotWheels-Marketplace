# Hot Wheels Marketplace - Testing Documentation

This document describes the comprehensive testing suite implemented for the Hot Wheels Marketplace backend.

## Table of Contents
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Types](#test-types)
- [Load Testing](#load-testing)
- [Coverage](#coverage)

## Test Structure

```
backend/tests/
├── setupEnv.ts          # Environment configuration for tests
├── setupTests.ts        # Jest global setup/teardown
├── integration/         # API integration tests
│   ├── auth.test.ts     # Authentication endpoints
│   ├── listings.test.ts # Listings CRUD operations
│   ├── users.test.ts    # User profile operations
│   ├── messages.test.ts # Messaging functionality
│   ├── wishlist.test.ts # Wishlist operations
│   └── admin.test.ts    # Admin endpoints
└── unit/               # Unit tests
    ├── password.test.ts # Password hashing utilities
    └── token.test.ts    # JWT token utilities
```

## Running Tests

### Prerequisites
1. Ensure PostgreSQL is running (Docker container)
2. Create test database: `hotwheels_test`
3. Run migrations on test database if needed

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run load tests (requires backend running on port 4000)
npm run test:load

# Run stress tests
npm run test:stress

# Generate load test HTML report
npm run test:load:report
```

## Test Types

### Integration Tests
Integration tests verify API endpoints work correctly with the database and authentication.

#### Auth Tests (`auth.test.ts`)
- ✅ User registration with validation
- ✅ Login with valid/invalid credentials
- ✅ Logout functionality
- ✅ Token refresh mechanism
- ✅ Email format validation
- ✅ Password strength requirements

**Total: 13 test cases**

#### Listings Tests (`listings.test.ts`)
- ✅ Create listing (authentication, validation, price checks)
- ✅ Get listings (pagination, filtering)
- ✅ Search by condition, rarity, price range
- ✅ Get listing by ID
- ✅ Update own listings (permission checks)
- ✅ Delete listings

**Total: 14+ test cases**

#### Users Tests (`users.test.ts`)
- ✅ Get current user profile
- ✅ Update profile information
- ✅ Get public user profiles
- ✅ Bio length validation
- ✅ 404 handling for non-existent users

**Total: 5 test cases**

#### Messages Tests (`messages.test.ts`)
- ✅ Create message threads
- ✅ Send messages
- ✅ Get thread messages
- ✅ Participant validation
- ✅ Message length limits
- ✅ Permission checks

**Total: 7 test cases**

#### Wishlist Tests (`wishlist.test.ts`)
- ✅ Add items to wishlist
- ✅ Get user wishlist
- ✅ Remove items from wishlist
- ✅ Duplicate prevention
- ✅ 404 handling

**Total: 5 test cases**

#### Admin Tests (`admin.test.ts`)
- ✅ Get platform statistics
- ✅ List all users with pagination
- ✅ Update user roles
- ✅ Admin-only access control

**Total: 6 test cases**

### Unit Tests
Unit tests verify individual utility functions work correctly in isolation.

#### Password Tests (`password.test.ts`)
- ✅ Password hashing with bcrypt
- ✅ Password verification
- ✅ Salt randomization
- ✅ Case sensitivity

**Total: 6 test cases**

#### Token Tests (`token.test.ts`)
- ✅ Access token generation
- ✅ Refresh token generation
- ✅ Token verification
- ✅ Expiration handling
- ✅ Invalid token rejection

**Total: 9 test cases**

## Load Testing

Load tests simulate real-world traffic patterns using Artillery.

### Standard Load Test (`artillery.yml`)

#### Test Phases:
1. **Warm up** (60s): 5 requests/second
2. **Ramp up** (120s): 10→50 requests/second
3. **Sustained load** (180s): 50 requests/second
4. **Spike test** (60s): 100 requests/second

#### Scenarios:
- **User Authentication** (30%): Register and login flows
- **Browse Listings** (50%): Search, filter, pagination
- **Authenticated Actions** (20%): Profile, wishlist, messages
- **Create Listings** (10%): Write operations

#### Performance Thresholds:
- Max error rate: 1%
- P95 response time: < 500ms
- P99 response time: < 1000ms

### Stress Test (`artillery-stress.yml`)

Extreme load testing:
- **Duration**: 30 seconds
- **Rate**: 200 requests/second
- **Allowed error rate**: 5%
- **P95 latency**: < 2000ms

### Running Load Tests

```bash
# Start the backend server
npm run dev

# In another terminal, run load tests
npm run test:load

# For detailed HTML report
npm run test:load:report
# Open the generated HTML file in a browser
```

## Coverage

Target coverage goals:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

View coverage report:
```bash
npm run test:coverage
```

Coverage reports are generated in `/backend/coverage/` directory.

## Test Database

Tests use a separate database (`hotwheels_test`) configured in `.env.test`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/hotwheels_test"
PORT=4001
NODE_ENV=test
JWT_ACCESS_SECRET=test-access-secret
JWT_REFRESH_SECRET=test-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Database Cleanup

Tests automatically clean up after themselves:
- `beforeEach`: Clears all tables
- `afterAll`: Disconnects Prisma client
- Test timeout: 30 seconds

## Best Practices

1. **Isolation**: Each test is independent and can run in any order
2. **Cleanup**: Tests clean up their data in `afterAll` hooks
3. **Authentication**: Tests create their own users with unique emails
4. **Assertions**: Comprehensive assertions for both success and error cases
5. **Real Data**: Integration tests use real database operations

## Troubleshooting

### Tests Timing Out
- Increase timeout in `setupTests.ts` (default: 30s)
- Check if PostgreSQL container is running
- Verify test database connection

### Database Errors
- Ensure migrations are run on test database
- Check `.env.test` configuration
- Verify PostgreSQL port (5434)

### Load Test Failures
- Ensure backend is running on port 4000
- Check server logs for errors
- Reduce load test intensity if needed

## Future Enhancements

- [ ] E2E tests with Playwright
- [ ] Performance regression tests
- [ ] API contract testing
- [ ] Mock external services
- [ ] Parallel test execution
- [ ] CI/CD integration
- [ ] Automated coverage reports

## Contributing

When adding new features:
1. Write unit tests for new utilities
2. Write integration tests for new endpoints
3. Update load test scenarios if needed
4. Maintain > 80% code coverage
5. Ensure all tests pass before committing
