---
'@vinsmokemau/cup-noobles-tokens': patch
'@vinsmokemau/cup-noobles-nuxt': patch
'@vinsmokemau/cup-noobles-email': patch
---

Added: publish the three packages privately to GitHub Packages (T12.1, REQ-070, OD-03). Each package now declares its registry, its repository, and the files a tarball holds, and the release workflow publishes after the "Version packages" pull request merges.
