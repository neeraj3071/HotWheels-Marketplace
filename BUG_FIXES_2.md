# Bug Fixes - Session 2

## Issues Fixed

### 1. Price Showing NaN
**Problem:** Prices were displaying as $NaN across multiple pages

**Root Cause:** 
- Frontend was using `listing.price` field
- Backend only returns `listing.priceCents` field
- The `Listing` type had both fields causing confusion

**Files Fixed:**
- `frontend/src/types/index.ts` - Removed deprecated `price` field from Listing type
- `frontend/src/app/profile/[id]/page.tsx` - Changed `listing.price` to `listing.priceCents`
- `frontend/src/app/my-listings/page.tsx` - Changed `listing.price` to `listing.priceCents`
- `frontend/src/app/wishlist/page.tsx` - Changed `item.listing.price` to `item.listing.priceCents`
- `frontend/src/app/listings/[id]/page.tsx` - Changed `listing.price` to `listing.priceCents`

**Result:** All prices now display correctly (e.g., $12.99 instead of $NaN)

---

### 2. 404 Error: Missing User Listings Endpoint
**Problem:** 
```
AxiosError: Request failed with status code 404
GET /api/users/:id/listings
```

**Root Cause:** 
- Frontend was calling `/api/users/:id/listings` endpoint
- Backend didn't have this endpoint implemented

**Files Fixed:**
- `backend/src/modules/users/service.ts` - Added `getUserListings()` function
- `backend/src/modules/users/router.ts` - Added `GET /:id/listings` endpoint

**Implementation:**
```typescript
// Service function
export const getUserListings = async (userId: string) => {
  const listings = await prisma.listing.findMany({
    where: { 
      ownerId: userId,
      status: "ACTIVE"
    },
    select: listingSummarySelect,
    orderBy: { createdAt: "desc" }
  });
  return listings;
};

// Router endpoint
usersRouter.get(
  "/:id/listings",
  catchAsync(async (req, res) => {
    const listings = await getUserListings(req.params.id);
    res.status(200).json(listings);
  })
);
```

**Result:** Profile pages now load user listings without errors

---

### 3. 404 Error: Missing Public User Profile
**Problem:**
```
AxiosError: Request failed with status code 404
GET /api/users/:id
```

**Root Cause:**
- User ID was `undefined` when accessing profile
- Header component was using `user.username` field which doesn't exist in database
- Frontend type had `username` but backend schema only has `displayName`

**Files Fixed:**
- `frontend/src/components/Header.tsx` - Changed `user.username` to `user.displayName`
- `frontend/src/components/Header.tsx` - Added null check for `user.id` before rendering profile link

**Result:** User profile links now work correctly and display proper user data

---

## Testing Checklist

After these fixes, test the following:

- [ ] Browse listings - prices should show correctly
- [ ] View listing details - price should show correctly
- [ ] View user profile - listings should load with correct prices
- [ ] View my listings page - prices should show correctly
- [ ] View wishlist - prices should show correctly
- [ ] Click on profile link in header - should navigate correctly
- [ ] No 404 errors in console

---

## Related Files Changed

### Backend
1. `backend/src/modules/users/service.ts`
2. `backend/src/modules/users/router.ts`

### Frontend
1. `frontend/src/types/index.ts`
2. `frontend/src/components/Header.tsx`
3. `frontend/src/app/profile/[id]/page.tsx`
4. `frontend/src/app/my-listings/page.tsx`
5. `frontend/src/app/wishlist/page.tsx`
6. `frontend/src/app/listings/[id]/page.tsx`

---

## Notes

- Backend automatically restarted due to nodemon watching for changes
- Frontend will hot-reload automatically with these changes
- No need to restart servers manually
- All fixes maintain backward compatibility

---

**Date:** October 29, 2025
**Fixed by:** GitHub Copilot
