# GitHub Setup Guide 🚀

Follow these steps to host your StudyHub Ireland website on GitHub Pages.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the `+` icon in the top right and select "New repository"
3. Fill in the details:
   - **Repository name**: `Study-site` (or any name you prefer)
   - **Description**: "Study platform for Irish Leaving Cert and Junior Cert students"
   - **Visibility**: Public (required for free GitHub Pages)
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these in your terminal:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/Study-site.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin master
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Alternative: If you prefer SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR_USERNAME/Study-site.git
git push -u origin master
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (top right of the repository page)
3. Scroll down to the "Pages" section in the left sidebar
4. Under "Source", select:
   - **Branch**: `master` (or `main`)
   - **Folder**: `/ (root)`
5. Click "Save"

## Step 4: Access Your Website

After a few minutes, your site will be live at:

```
https://YOUR_USERNAME.github.io/Study-site/
```

GitHub will also show you this URL in the Pages settings.

## Step 5: Custom Domain (Optional)

If you want to use a custom domain like `studyhub.ie`:

1. Buy a domain from a registrar (e.g., GoDaddy, Namecheap, Google Domains)
2. In your GitHub repository settings → Pages, add your custom domain
3. Configure DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```
4. Wait for DNS propagation (can take up to 48 hours, usually much faster)

## Updating Your Site

Whenever you make changes:

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Description of your changes"

# Push to GitHub
git push
```

Your GitHub Pages site will automatically update within a few minutes!

## Quick Commands Reference

```bash
# Check status of your files
git status

# See what you've changed
git diff

# View commit history
git log --oneline

# Create a new branch for development
git checkout -b development

# Switch back to master
git checkout master

# Merge development into master
git merge development
```

## Troubleshooting

### Problem: "Remote already exists"
```bash
# Remove the existing remote
git remote remove origin

# Add it again with the correct URL
git remote add origin https://github.com/YOUR_USERNAME/Study-site.git
```

### Problem: "Permission denied"
- Make sure you're logged into GitHub
- Check your GitHub username/password or SSH keys
- Use a Personal Access Token instead of password for HTTPS

### Problem: Site not updating
- Wait a few minutes (GitHub Pages can take 1-10 minutes to update)
- Check the Actions tab in your repository for build status
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)

### Problem: 404 error
- Make sure `index.html` is in the root directory
- Check that GitHub Pages is enabled and pointing to the correct branch
- Verify the URL is correct: `username.github.io/repository-name/`

## Testing Locally

To test your site locally before pushing:

1. **Simple way**: Just open `index.html` in your browser
2. **With a local server** (recommended for testing):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Then visit http://localhost:8000
   ```

## Security Note

Remember:
- Never commit sensitive information (API keys, passwords)
- Use environment variables for sensitive data
- The `.gitignore` file is already set up to exclude common sensitive files

## Need Help?

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Support](https://support.github.com/)

---

**Happy coding! 🎉**
