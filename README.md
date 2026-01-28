# Strategic Planner Pro

A production-ready, AI-powered strategic planning platform built with React, TypeScript, and Vite. This application empowers leaders and organizations with deep diagnosis and structured tools based on the science of strategic thinking.

![Strategic Planner Pro](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### 🎯 Core Capabilities

- **SWOT Analysis** - Comprehensive analysis framework for Strengths, Weaknesses, Opportunities, and Threats
- **Balanced Scorecard (BSC)** - Four perspectives: Financial, Customer, Internal Process, and Learning & Growth
- **Strategic Options Development** - Derive strategies from SWOT combinations (SO, ST, WO, WT)
- **Key Performance Indicators (KPIs)** - Track and monitor performance metrics
- **Programs & Action Plans (PAPs)** - Detailed implementation roadmaps with activities, budgets, and resources
- **Real-time Dashboard** - Visual overview of strategic plan progress and alignment

### ✨ Production-Ready Features

- **Offline-First Architecture** - Works without internet connection using LocalStorage
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support** - Toggle between light and dark themes
- **Type-Safe** - Full TypeScript implementation for robust code
- **Modern UI** - Built with shadcn/ui and Tailwind CSS
- **Performance Optimized** - Fast loading and smooth interactions
- **Authentication Ready** - Supabase integration for user management

## Tech Stack

- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4 with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Hooks with custom strategic plan store
- **Routing**: React Router 6.26
- **Backend Ready**: Supabase integration for authentication and data persistence
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd strategic-planner-pro
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Project Structure

```
strategic-planner-pro/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── swot/            # SWOT analysis components
│   │   ├── strategy/        # Strategic options components
│   │   ├── bsc/             # Balanced scorecard components
│   │   ├── pap/             # Program & action plan components
│   │   └── reports/         # Report generation components
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useStrategicPlan.ts  # Strategic plan management
│   │   └── use-toast.ts     # Toast notifications
│   ├── lib/                 # Utility libraries
│   │   ├── supabase.ts      # Supabase client
│   │   ├── strategicPlanStore.ts  # Data models & storage
│   │   └── utils.ts         # Helper functions
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Main dashboard
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Root application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Usage Guide

### Creating a Strategic Plan

1. Navigate to the dashboard
2. Click "Create Strategic Plan"
3. Fill in organization details, vision, mission, and values
4. Set the planning timeframe

### SWOT Analysis

1. Go to the "SWOT Analysis" tab
2. Add items to each category (Strengths, Weaknesses, Opportunities, Threats)
3. Categorize and prioritize items
4. Use the analysis to inform strategic options

### Developing Strategic Options

1. Navigate to "Strategy Options"
2. Create options based on SWOT combinations:
   - **SO**: Leverage strengths to capitalize on opportunities
   - **ST**: Use strengths to mitigate threats
   - **WO**: Address weaknesses to pursue opportunities
   - **WT**: Minimize weaknesses and avoid threats
3. Rate feasibility and impact
4. Link to specific SWOT items

### Balanced Scorecard Setup

1. Go to "Balanced Scorecard" tab
2. Add objectives across four perspectives:
   - **Financial**: Revenue, profitability, cost efficiency
   - **Customer**: Satisfaction, retention, market share
   - **Internal Process**: Operations, quality, innovation
   - **Learning & Growth**: Skills, culture, capabilities
3. Link objectives to strategic options
4. Define KPIs for each objective
5. Set targets and track progress

### Creating Action Plans

1. Navigate to "Action Plans" tab
2. Create a Program & Action Plan (PAP) for each objective
3. Define activities with timelines
4. Allocate budget and resources
5. Identify risks and mitigation strategies
6. Track progress and status

## Configuration

### Customizing the Theme

Edit `tailwind.config.ts` to customize colors, fonts, and other design tokens:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: 'hsl(221 83% 53%)',
        foreground: 'hsl(210 40% 98%)',
      },
      // Add more custom colors
    },
  },
}
```

### Adding New Components

Use shadcn/ui CLI to add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

## Database Schema (Supabase)

If using Supabase for data persistence, create these tables:

### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  organization TEXT,
  job_title TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_preferences JSONB
);
```

### strategic_plans
```sql
CREATE TABLE strategic_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  organization TEXT,
  timeframe JSONB,
  vision TEXT,
  mission TEXT,
  values TEXT[],
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Additional tables for swot_items, strategic_options, objectives, kpis, and paps can be created following the data models in `src/lib/strategicPlanStore.ts`.

## Development

### Code Style

- Follow ESLint and TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages

### Testing

```bash
npm run lint
# or
yarn lint
```

### Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Performance

The application is optimized for performance:
- Code splitting and lazy loading
- Optimized bundle size
- Efficient re-rendering with React hooks
- LocalStorage for offline capability
- Debounced inputs and throttled updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@strategicplannerpro.com or open an issue on GitHub.

## Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/)

## Roadmap

- [ ] Advanced analytics and reporting
- [ ] Collaboration features
- [ ] AI-powered strategic recommendations
- [ ] Export to PDF/Excel
- [ ] Mobile applications
- [ ] Integration with project management tools
- [ ] Multi-language support
- [ ] Advanced data visualization

---

Built with ❤️ by the Strategic Planner Pro Team
