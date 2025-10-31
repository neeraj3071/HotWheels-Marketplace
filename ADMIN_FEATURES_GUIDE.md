# Admin Features Guide

## Location of Admin Features

### Frontend
**Page:** `frontend/src/app/admin/page.tsx`
**Route:** http://localhost:3000/admin

### Backend Endpoints
**Base Path:** `/api/admin/*`
**File:** `backend/src/modules/admin/router.ts`

---

## Available Admin Features

### 1. Statistics Dashboard
**Endpoint:** `GET /api/admin/stats`

**Displays:**
- Total Users
- Total Listings
- Active Listings
- Total Messages

### 2. User Management
**Endpoint:** `GET /api/admin/users`

**Features:**
- View all users with pagination
- Search users by email or display name
- See user roles (USER, ADMIN)
- See join dates

**Change User Role:**
- **Endpoint:** `PATCH /api/admin/users/:id/role`
- **Body:** `{ role: "USER" | "ADMIN" }`
- Dropdown select in the UI to change roles

### 3. Listing Moderation
**Endpoint:** `GET /api/listings` (with admin access)

**Features:**
- View recent listings
- See listing owner
- See listing status
- Delete inappropriate listings

**Delete Listing:**
- **Endpoint:** `DELETE /api/admin/listings/:id`
- Archives the listing (soft delete)

**Update Listing Status:**
- **Endpoint:** `PATCH /api/admin/listings/:id/status`
- **Body:** `{ status: "ACTIVE" | "ARCHIVED" | "SOLD" }`

---

## How to Access Admin Features

### Step 1: Make Your User an Admin

You need to manually set your user role to ADMIN in the database.

**Option A: Using Prisma Studio (Recommended)**
```bash
cd backend
npx prisma studio
```
Then:
1. Open the `User` table
2. Find your user
3. Change `role` from `USER` to `ADMIN`
4. Save

**Option B: Using SQL**
```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

**Option C: Using psql CLI**
```bash
# Connect to your database
psql your_database_url

# Update your user
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Step 2: Access the Admin Panel

1. **Login** to your account (with ADMIN role)
2. **Click your profile** avatar in the header
3. **Click "Admin Panel"** in the dropdown (orange text)
4. Or navigate directly to: http://localhost:3000/admin

---

## Admin Panel Features

### Dashboard Overview
```
┌─────────────────────────────────────────┐
│  🛡️ Admin Dashboard                     │
├─────────────────────────────────────────┤
│                                         │
│  [Total Users] [Total Listings]        │
│  [Active Listings] [Total Messages]    │
│                                         │
├─────────────────────────────────────────┤
│  User Management                        │
├─────────────────────────────────────────┤
│  Name     Email      Role    Actions    │
│  John     john@      USER    [Dropdown] │
│  Admin    admin@     ADMIN   [Dropdown] │
│                                         │
├─────────────────────────────────────────┤
│  Recent Listings                        │
├─────────────────────────────────────────┤
│  Title    Owner    Price    [Delete]    │
│  Car 1    John     $50.00   [Delete]    │
└─────────────────────────────────────────┘
```

### User Management Table
- **Display Name:** User's public name
- **Email:** User's email address
- **Role Badge:** Color-coded (ADMIN = orange, USER = gray)
- **Joined Date:** Account creation date
- **Actions:** Dropdown to change role (USER ↔ ADMIN)

### Listings Moderation Table
- **Title:** Listing name
- **Owner:** Who created the listing
- **Price:** Listed price
- **Status Badge:** ACTIVE, ARCHIVED, or SOLD
- **Delete Button:** Archive/remove listing

---

## Security & Authorization

### Middleware Protection
All admin routes are protected by:
1. **Authentication:** Must be logged in
2. **Role Check:** Must have ADMIN role

```typescript
adminRouter.use(authenticate, requireRole("ADMIN"));
```

### Access Denied Behavior
- Non-admins trying to access `/admin` → Redirected to homepage
- API requests without ADMIN role → 403 Forbidden error

---

## Testing Admin Features

### Test Checklist

1. **Access Control**
   - [ ] Regular users cannot see "Admin Panel" link
   - [ ] Regular users get redirected from /admin
   - [ ] Admin users see "Admin Panel" in menu
   - [ ] Admin users can access /admin page

2. **Statistics**
   - [ ] Dashboard shows correct user count
   - [ ] Dashboard shows correct listing count
   - [ ] Dashboard shows active vs total listings
   - [ ] Dashboard shows message count

3. **User Management**
   - [ ] Can view all users
   - [ ] Can change user from USER to ADMIN
   - [ ] Can change user from ADMIN to USER
   - [ ] Changes persist after refresh

4. **Listing Moderation**
   - [ ] Can view all listings
   - [ ] Can delete a listing
   - [ ] Deleted listing no longer shows in browse
   - [ ] Owner cannot see deleted listing

---

## Common Issues & Solutions

### Issue: "Admin Panel" not showing in menu
**Solution:** Make sure your user has `role = 'ADMIN'` in database

### Issue: 403 Forbidden when accessing admin routes
**Solution:** 
1. Check if you're logged in
2. Verify your user role is ADMIN
3. Clear cookies and login again

### Issue: Cannot change user roles
**Solution:** 
- Check backend console for errors
- Verify endpoint is `PATCH /admin/users/:id/role`
- Verify request body: `{ role: "ADMIN" }`

### Issue: Stats not loading
**Solution:**
- Check backend is running
- Check `/api/admin/stats` endpoint is accessible
- Check browser console for errors

---

## Future Enhancements

Potential admin features to add:
- [ ] Ban/suspend users
- [ ] View all messages (moderation)
- [ ] Bulk operations
- [ ] Analytics charts
- [ ] Activity logs
- [ ] Export data
- [ ] Email notifications to users
- [ ] Featured listings management
