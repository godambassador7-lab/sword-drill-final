# Pre-Publish Checklist for Sword Drill

Before publishing your Sword Drill repository to GitHub as a public repo, complete this checklist to ensure sensitive game logic is properly protected.

## ✅ Core Logic Protection

- [ ] **Created private `sword-drill-core` repository on GitHub**
  - Repository name: `sword-drill-core`
  - Visibility: **PRIVATE** (double-check this!)
  - Pushed all `src/core` content to private repo

- [ ] **Configured `src/core` as Git submodule**
  - Removed `src/core` from main repo tracking: `git rm -r --cached src/core`
  - Added as submodule: `git submodule add <private-repo-url> src/core`
  - Committed submodule reference to main repo
  - Verified `.gitmodules` file exists and points to private repo

- [ ] **Tested submodule setup**
  - Cloned main repo in temp directory: `git clone --recursive <main-repo>`
  - Without access to private repo, `src/core` should be empty
  - With access, `git submodule update --init` populates `src/core`

## ✅ Import Verification

- [ ] **All sensitive logic now imported from `./core`**
  - `ACHIEVEMENT_TIERS` imported from `'./core'`
  - `ACHIEVEMENTS` imported from `'./core'`
  - `checkForNewAchievements` imported from `'./core'`
  - `LEVEL_REQUIREMENTS` imported from `'./core'`
  - `POINT_SYSTEM` imported from `'./core'`
  - `QUIZ_POINTS` imported from `'./core'`
  - `matchBiblicalReference` imported from `'./core'`
  - `DEFAULT_VERSE_FALLBACK` imported from `'./core'`
  - `VERSE_DATABASE` imported from `'./core'`

- [ ] **No sensitive constants defined in App.js**
  - Searched for `const ACHIEVEMENT_TIERS` - should only be import
  - Searched for `const LEVEL_REQUIREMENTS` - should only be import
  - Searched for `const POINT_SYSTEM` - should only be import
  - Searched for `const matchBiblicalReference` - should only be import

## ✅ Application Testing

- [ ] **Build succeeds**
  - `npm run build` completes without errors
  - No import errors related to core modules

- [ ] **All features working**
  - Achievement unlocking works correctly
  - Points awarded as expected
  - Level progression triggers properly
  - Quiz difficulty scales with user level
  - Answer validation accepts correct answers
  - Fuzzy matching for biblical references works
  - Daily verse rotates correctly
  - Personal verse bank functions properly

- [ ] **Tested both with and without core**
  - With `src/core` present: App works normally
  - Without `src/core` (simulating public clone): Build fails gracefully with clear error

## ✅ Documentation

- [ ] **Created documentation files**
  - `src/core/README.md` exists with module documentation
  - `CORE_SETUP_GUIDE.md` in main repo explains setup process
  - `PRE_PUBLISH_CHECKLIST.md` (this file) completed

- [ ] **Updated main README.md**
  - Added section about core logic submodule
  - Included setup instructions for contributors
  - Mentioned that some features require private repo access

## ✅ Security Checks

- [ ] **Sensitive data files protected**
  - `src/data/sword_drill_achievements/achievements.json` not in public repo
  - `src/data/sword_drill_achievements/achievement_conditions.json` not in public repo
  - Check with: `git ls-files | grep achievements.json`

- [ ] **.gitignore configured**
  - Added `src/core/` to `.gitignore` (optional, but recommended)
  - Verified no sensitive files tracked

- [ ] **Environment variables**
  - No API keys or secrets in code
  - Firebase config uses environment variables (if applicable)

- [ ] **Git history clean**
  - No sensitive data in previous commits
  - If needed, used `git filter-branch` to remove sensitive history
  - Searched history: `git log --all --full-history -- src/core/`

## ✅ Repository Settings

- [ ] **Main repository configured**
  - Repository name appropriate
  - Description added
  - Topics/tags added for discoverability
  - License selected (MIT, GPL, etc.)

- [ ] **Private repository secured**
  - `sword-drill-core` visibility is PRIVATE
  - Only trusted collaborators have access
  - Branch protection enabled (optional but recommended)

- [ ] **Collaborator access configured**
  - List of people who need access to private repo documented
  - Invited collaborators to private repo
  - Verified they can clone with submodules

## ✅ Final Verification

- [ ] **Test public clone simulation**
  ```bash
  # In a temp directory (without GitHub authentication)
  git clone <your-public-repo-url>
  cd sword-drill
  # Should see src/core folder but it's empty or has placeholder
  npm install
  npm run build
  # Should fail with clear error about missing core modules
  ```

- [ ] **Test private clone (with access)**
  ```bash
  # In a temp directory (with GitHub authentication)
  git clone --recursive <your-public-repo-url>
  cd sword-drill
  # Should populate src/core from private repo
  npm install
  npm run build
  # Should succeed
  npm start
  # App should work normally
  ```

- [ ] **Verify .gitmodules content**
  ```bash
  cat .gitmodules
  # Should show:
  # [submodule "src/core"]
  #   path = src/core
  #   url = https://github.com/YOUR_USERNAME/sword-drill-core.git
  ```

## ✅ Deployment Considerations

- [ ] **Build process updated**
  - CI/CD has access to private submodule
  - Build scripts include `git submodule update --init --recursive`
  - Deployment platform configured with SSH key or access token

- [ ] **Hosting environment**
  - Vercel/Netlify/GitHub Pages configured
  - Build command includes submodule initialization
  - Environment variables set for production

## ✅ Documentation for Contributors

- [ ] **CONTRIBUTING.md created** (optional)
  - Explains how to get access to core logic
  - Describes setup process for developers
  - Includes coding standards and PR process

- [ ] **README.md sections added**
  ```markdown
  ## For Contributors

  This project uses a private Git submodule for core game logic. To contribute:

  1. Request access to the private `sword-drill-core` repository
  2. Clone with submodules: `git clone --recursive <repo-url>`
  3. See CORE_SETUP_GUIDE.md for detailed setup instructions
  ```

## ✅ Legal & Licensing

- [ ] **LICENSE file added**
  - License selected and file created
  - Copyright year and owner specified
  - License applies to public code only (core is separate)

- [ ] **Attribution**
  - Any third-party libraries credited
  - Bible translation sources cited
  - Asset creators acknowledged

## 🚨 Final Warning Checklist

Before clicking "Publish" or "Make Public":

- [ ] **STOP**: Is `sword-drill-core` repository visibility set to PRIVATE?
- [ ] **STOP**: Did you verify `src/core` is NOT directly tracked in main repo?
- [ ] **STOP**: Did you test that cloning without private repo access shows no sensitive data?
- [ ] **STOP**: Did you search for any hardcoded secrets or API keys?
- [ ] **STOP**: Did you review all commits for accidentally added sensitive files?

## 📝 Post-Publication Tasks

After publishing to public GitHub:

- [ ] **Monitor repository**
  - Watch for issues/PRs that might reveal sensitive logic
  - Set up notifications for new contributors

- [ ] **Document internal team**
  - Share private repo access with team members
  - Explain submodule workflow in team documentation

- [ ] **Regular audits**
  - Quarterly review of who has access to private repo
  - Check for any leaks or security issues
  - Update dependencies and security patches

## ✅ Success Criteria

Your repository is ready to publish when:

1. ✅ Main repo can be cloned publicly but won't build without core
2. ✅ Core logic is only accessible to authorized collaborators
3. ✅ All tests pass when core is available
4. ✅ Documentation clearly explains setup process
5. ✅ No sensitive data in public repo history
6. ✅ Deployment works with proper credentials

---

## 🎉 Ready to Publish!

Once all items are checked, you can safely publish your Sword Drill repository to GitHub!

**Final Command:**
```bash
# In main repo
git status  # Verify everything is committed
git push origin main  # Push to public repository

# Make repository public on GitHub:
# Settings → Danger Zone → Change visibility → Make public
```

**Remember:**
- The `src/core` submodule reference is public (commit hashes)
- The actual core logic remains in your private repository
- Users can see that core logic exists, but not its contents
- This is by design - "defense in depth"

Good luck with your public release! 🚀
