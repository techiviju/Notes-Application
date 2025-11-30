# Notes App - Complete Deployment Guide

This guide will walk you through deploying both the Spring Boot backend and React frontend to production.

## Prerequisites

- GitHub account
- Render/Railway/Heroku account (for backend)
- Vercel account (for frontend)
- Git installed locally

## Part 1: Backend Deployment (Spring Boot)

### Option A: Render (Recommended)

1. **Prepare the Backend:**
   ```bash
   # Ensure you're in the project root
   cd Note_app
   
   # Build the JAR file
   ./mvnw clean package -DskipTests
   
   # Verify JAR was created
   ls -la target/*.jar
   ```

2. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy to Render:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your Spring Boot app
   - Configure the service:
     - **Name**: `notes-backend`
     - **Environment**: `Java`
     - **Build Command**: `./mvnw clean package -DskipTests`
     - **Start Command**: `java -jar target/notes-app-backend-1.0.0.jar`
     - **Port**: `8080`
   - Click "Create Web Service"

4. **Get Backend URL:**
   - Once deployed, you'll get a URL like: `https://notes-backend.onrender.com`
   - Test it: `https://notes-backend.onrender.com/api/notes`

### Option B: Railway

1. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Spring Boot and deploy

2. **Configure Railway:**
   - In Railway dashboard, go to your service
   - Go to "Settings" → "Deploy"
   - Set build command: `./mvnw clean package -DskipTests`
   - Set start command: `java -jar target/notes-app-backend-1.0.0.jar`

### Option C: Heroku

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy to Heroku:**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create notes-backend-app
   
   # Set Java buildpack
   heroku buildpacks:set heroku/java
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option D: Fly.io

1. **Install Fly CLI:**
   ```bash
   # macOS
   brew install flyctl
   
   # Windows
   # Download from https://fly.io/docs/hands-on/install-flyctl/
   ```

2. **Deploy to Fly.io:**
   ```bash
   # Login to Fly
   fly auth login
   
   # Initialize Fly app
   fly launch
   
   # Deploy
   fly deploy
   ```

## Part 2: Frontend Deployment (React on Vercel)

1. **Prepare the Frontend:**
   ```bash
   # Ensure you're in the project root
   cd Note_app
   
   # Create .env file with your backend URL
   echo "VITE_API_URL=https://your-backend-url.onrender.com/api" > .env
   
   # Test locally first
   npm run dev
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `./` (or leave empty)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Click "Deploy"

3. **Set Environment Variables:**
   - In Vercel dashboard, go to your project
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
   - Redeploy the project

## Part 3: CORS Configuration

The CORS configuration is already added to the backend. If you need to modify it:

1. **Update CorsConfig.java:**
   ```java
   @Configuration
   public class CorsConfig {
       @Bean
       public WebMvcConfigurer corsConfigurer() {
           return new WebMvcConfigurer() {
               @Override
               public void addCorsMappings(CorsRegistry registry) {
                   registry.addMapping("/**")
                           .allowedOrigins("*")  // Allow all origins
                           .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                           .allowedHeaders("*")
                           .allowCredentials(false)
                           .maxAge(3600);
               }
           };
       }
   }
   ```

2. **For Production, restrict origins:**
   ```java
   .allowedOrigins("https://your-frontend-url.vercel.app")
   ```

## Part 4: Database Configuration

### For Production (Recommended)

1. **Add PostgreSQL dependency to pom.xml:**
   ```xml
   <dependency>
       <groupId>org.postgresql</groupId>
       <artifactId>postgresql</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

2. **Update application.properties:**
   ```properties
   # Production Database (PostgreSQL)
   spring.datasource.url=${DATABASE_URL}
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Set environment variables in your deployment platform:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `DB_USERNAME`: Database username
   - `DB_PASSWORD`: Database password

### For Development (H2)
The current setup uses H2 in-memory database, which resets on every restart. This is fine for development and testing.

## Part 5: Testing the Deployment

### 1. Test Backend API

```bash
# Test if backend is running
curl https://your-backend-url.onrender.com/api/notes

# Test creating a note
curl -X POST https://your-backend-url.onrender.com/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Note", "content": "This is a test note"}'

# Test getting a specific note
curl https://your-backend-url.onrender.com/api/notes/1

# Test sharing a note
curl https://your-backend-url.onrender.com/api/notes/share/1
```

### 2. Test Frontend

1. **Open your Vercel URL:**
   - Go to `https://your-frontend-url.vercel.app`
   - Verify the app loads

2. **Test CRUD Operations:**
   - Create a new note
   - Edit an existing note
   - Delete a note
   - Verify all operations work

3. **Test Share Feature:**
   - Click "Share" on any note
   - Copy the generated link
   - Open the link in a new tab
   - Verify the note displays in read-only mode

## Part 6: Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check CORS configuration in `CorsConfig.java`
   - Verify frontend URL is allowed
   - Check browser console for CORS errors

2. **API Connection Issues:**
   - Verify `VITE_API_URL` environment variable
   - Check if backend is running
   - Test API endpoints directly

3. **Build Failures:**
   - Check build logs in deployment platform
   - Verify all dependencies are installed
   - Check for TypeScript/JavaScript errors

4. **Database Issues:**
   - Check database connection string
   - Verify database credentials
   - Check if database is accessible

### Debug Steps

1. **Check Backend Logs:**
   - Render: Go to your service → "Logs"
   - Railway: Go to your service → "Logs"
   - Heroku: `heroku logs --tail`

2. **Check Frontend Logs:**
   - Vercel: Go to your project → "Functions" → "Logs"
   - Check browser console for errors

3. **Test API Endpoints:**
   ```bash
   # Test if backend is responding
   curl https://your-backend-url.onrender.com/api/notes
   
   # Test if frontend can reach backend
   curl https://your-frontend-url.vercel.app
   ```

## Part 7: Production Checklist

### Backend Checklist
- [ ] JAR file builds successfully
- [ ] Application starts without errors
- [ ] API endpoints respond correctly
- [ ] CORS is configured properly
- [ ] Database connection works
- [ ] Environment variables are set
- [ ] Logs are accessible

### Frontend Checklist
- [ ] Build completes successfully
- [ ] Environment variables are set
- [ ] API calls work correctly
- [ ] All CRUD operations work
- [ ] Share feature works
- [ ] Error handling works
- [ ] Loading states work

### Integration Checklist
- [ ] Frontend can create notes
- [ ] Frontend can read notes
- [ ] Frontend can update notes
- [ ] Frontend can delete notes
- [ ] Share links work correctly
- [ ] Error messages display properly
- [ ] Loading states show correctly

## Part 8: Monitoring and Maintenance

### Backend Monitoring
- Monitor API response times
- Check error rates
- Monitor database performance
- Set up alerts for failures

### Frontend Monitoring
- Monitor page load times
- Check for JavaScript errors
- Monitor API call success rates
- Set up error tracking

### Regular Maintenance
- Update dependencies regularly
- Monitor security vulnerabilities
- Backup database regularly
- Review and update environment variables

## Part 9: Scaling Considerations

### Backend Scaling
- Use a managed database service
- Implement caching (Redis)
- Use a CDN for static assets
- Consider microservices architecture

### Frontend Scaling
- Use a CDN for static assets
- Implement code splitting
- Use lazy loading for components
- Consider server-side rendering

## Success Indicators

✅ **Backend Deployed**: API responds at `https://your-backend-url.onrender.com/api/notes`
✅ **Frontend Deployed**: App loads at `https://your-frontend-url.vercel.app`
✅ **API Connected**: Frontend can create/read/update/delete notes
✅ **Share Working**: Share links open notes in read-only mode
✅ **Error Handling**: Toast notifications appear for errors
✅ **Loading States**: Spinners show during API calls

## Final Notes

- Always test locally before deploying
- Keep your environment variables secure
- Monitor your deployments regularly
- Have a rollback plan ready
- Document any custom configurations

Happy deploying! 🚀
