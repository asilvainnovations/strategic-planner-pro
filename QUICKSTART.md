# Strategic Planner Pro - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Extract the Project
```bash
tar -xzf strategic-planner-pro.tar.gz
cd strategic-planner-pro
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment (Optional)
```bash
cp .env.example .env
# Edit .env with your Supabase credentials (or skip for offline mode)
```

### Step 4: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:8080` in your browser!

## 📁 Project Structure

```
strategic-planner-pro/
├── src/
│   ├── components/     # UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities & storage
│   ├── pages/          # Main pages
│   └── index.css       # Global styles
├── public/             # Static assets
├── README.md           # Full documentation
├── DEPLOYMENT.md       # Deployment guide
├── USER_GUIDE.md       # Comprehensive user guide
└── database-schema.sql # Database setup (Supabase)
```

## ✨ Key Features

- **SWOT Analysis** - Strategic assessment framework
- **Balanced Scorecard** - Four perspective objectives
- **Strategic Options** - TOWS matrix strategies
- **KPI Tracking** - Performance monitoring
- **Action Plans** - Implementation roadmaps
- **Offline-First** - Works without internet
- **Responsive Design** - Mobile, tablet, desktop

## 🎯 First Steps in the App

1. **Create a Plan**: Click "Create Strategic Plan"
2. **Add SWOT Items**: Go to SWOT Analysis tab
3. **Define Strategies**: Navigate to Strategy Options
4. **Set Objectives**: Use Balanced Scorecard tab
5. **Track KPIs**: Monitor performance
6. **Plan Actions**: Create Programs & Action Plans

## 📚 Documentation

- **README.md** - Complete project documentation
- **USER_GUIDE.md** - Detailed user instructions
- **DEPLOYMENT.md** - Deployment options and CI/CD
- **database-schema.sql** - Supabase database setup

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 Configuration

### Without Database (Offline Mode)
Works out of the box! Data stored in browser LocalStorage.

### With Supabase (Full Features)
1. Create a Supabase project at https://supabase.com
2. Run `database-schema.sql` in SQL Editor
3. Copy credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
4. Restart dev server

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Supabase** - Backend (optional)
- **React Router** - Navigation

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Other Options
- Netlify
- AWS S3 + CloudFront
- Docker
- Traditional VPS

See `DEPLOYMENT.md` for detailed instructions.

## 📖 Learning Resources

1. Start with `USER_GUIDE.md` for strategic planning concepts
2. Review `README.md` for technical details
3. Check `DEPLOYMENT.md` before going live
4. Explore the codebase - it's well-commented!

## 💡 Pro Tips

- **Sample Data**: App includes sample strategic plan on first load
- **Keyboard Shortcuts**: Press `?` for help (where available)
- **Export Data**: Regularly backup your plans (browser LocalStorage)
- **Mobile Friendly**: Access from any device
- **Dark Mode**: Toggle in settings

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or:
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check configuration
npm run lint
```

## 🤝 Support

- **Email**: support@strategicplannerpro.com
- **Issues**: GitHub Issues
- **Docs**: https://docs.strategicplannerpro.com

## 📝 License

MIT License - See LICENSE file

---

**Ready to build your strategic plan?**

```bash
npm run dev
```

Then navigate to `http://localhost:8080` and start planning! 🎯
