# Hot Wheels Marketplace - Frontend

A modern, full-featured Next.js 14 frontend for the Hot Wheels Marketplace application.

## 🚀 Features

### Authentication
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ Persistent auth state

### Listings
- ✅ Browse listings with search and filters
- ✅ Advanced filtering (condition, rarity, price range)
- ✅ Pagination support
- ✅ Create new listings with image upload
- ✅ Edit/delete own listings
- ✅ View detailed listing information
- ✅ Image gallery with navigation

### User Features
- ✅ User profiles with avatar
- ✅ Edit profile information
- ✅ View user's listings
- ✅ Wishlist management
- ✅ Add/remove items from wishlist

### Messaging
- ✅ Real-time messaging between users
- ✅ Thread-based conversations
- ✅ Message history
- ✅ Contact sellers directly

### UI Components
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Custom components (Button, Card, Input, etc.)
- ✅ Loading states
- ✅ Error handling

## 📦 Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔗 Backend Integration

Make sure the backend server is running on `http://localhost:4000` before starting the frontend.

## 📄 Available Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Homepage with features | No |
| `/login` | User login | No |
| `/register` | User registration | No |
| `/listings` | Browse all listings | No |
| `/listings/[id]` | View listing detail | No |
| `/listings/create` | Create new listing | Yes |
| `/profile/[id]` | View user profile | No |
| `/profile/edit` | Edit own profile | Yes |
| `/wishlist` | Manage wishlist | Yes |
| `/messages` | Messaging interface | Yes |
| `/my-listings` | Manage own listings | Yes |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom with Radix UI primitives

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

Built with ❤️ using Next.js and TypeScript
