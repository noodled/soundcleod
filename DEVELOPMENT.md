## Development

Requirements:

- Node.js (tested with recent LTS version)

Running tests:

    npm install
    npm test # all tests
    npm test -- test/options.js # a single test file

Running the application in development mode:

    npm install
    npm start

Running the packaged app on macOS:

    make pack
    dist/mac/SoundCleod.app/Contents/MacOS/SoundCleod

## Setting up the update server

- Go to https://github.com/GitbookIO/nuts
  - Click the "deploy to Heroku" button
  - Enter GitHub repo in `username/repo` format
  - Generate token here (leave all permissions off): https://github.com/settings/tokens
  - API username and password will be used for accessing Nuts' own internal API
- Verify if Nuts is working by going to https://app-name.herokuapp.com/
- Add a GitHub webhook here https://github.com/username/repo/settings/hooks/new
  - Set `GITHUB_SECRET` to a random string here: https://dashboard.heroku.com/apps/app-name/settings
  - Payload URL: https://app-name.herokuapp.com/refresh
  - Secret: enter the random string from above
  - Choose "Release published in a repository" event

## Redeploying the update server from CLI


- Clone the Nuts repo locally: https://github.com/GitbookIO/nuts
- Add the Heroku Git remote: `heroku git:remote --app soundcleod-updates`
- `git push heroku master`

## Packaging

Requirements on macOS:

- Run `brew install mono`
- Code signing identity in Keychain

## Working with self-signed code signing certificates on macOS

Start with opening Keychain Access.

Creating a certificate:

- Keychain Access menu > Certificate Assistant > Create a certificate...
- Enter your name (or whatever you want)
- Identity Type: Self Signed Root
- Certificate Type: Code Signing
- Continue, Done

Overriding the certificate trust levels:

- Open the certificate (double click)
- Expand "> Trust"
- Set "Code Signing" to "Always Trust"
- Close the certificate to save it
- Verify with `security find-identity -v -p codesigning`

Importing a certificate:

- File > Import items
- Select the certificate file
- Override trust levels as specified above

Exporting a macOS certificate for signing a Windows application:

- Find the certificate in Keychain Access
- Right click -> Export
- Choose .p12 format
- Add a strong password

## Tricks and tips

Starting SoundCleod with arguments on Windows (installed location)

    %USERPROFILE%\AppData\Local\soundcleod\Update.exe --processStart "SoundCleod.exe" --process-start-args "arg1 arg2"

Override what version to build:

    npm run dist -- --em.version=1.1.7-pre.1

Debugging packaging and code signing:

    DEBUG=electron-builder,electron-osx-sign make pack

Remove persisted data on macOS:

    rm -rf ~/Library/Application\ Support/SoundCleod\ development/
    
## Use the Chromium Web Developer Tools

Start SoundCleod with `npm start` or the installed application with `--developer-tools`:

    /Applications/SoundCleod.app/Contents/MacOS/SoundCleod --developer-tools
    
Use Cmd+Option+I to toggle Developer Tools or use  View > Toggle Developer Tools from the menu.

## Building the website

    brew install rbenv
    rbenv install 2.3.3 # install latest ruby
    rbenv local 2.3.3
    ruby --version
    make run

See more in [GitHub Pages
documentation](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/).

## Setting up GitHub tokens on Travis CI and AppVeyor

This is required for automatically publishing releases to GitHub.

- Create a [new personal access token on GitHub](https://github.com/settings/tokens)
    - Only enable `public_repo` permission
- [Encrypt the token for AppVeyor here](https://ci.appveyor.com/tools/encrypt)
- Update `environment.GH_TOKEN.secure` with the token in `appveyor.yml`
- Update the token in `.travis.yml` with `travis encrypt --add env GH_TOKEN=<the token>` (install the Travis Gem first with `gem install travis`)
- Commit and push both `.travis.yml` and `appveyor.yml`

## Set up code signing certificates on Travis CI and AppVeyor

- Export the certificate as `codesign-certificate.p12`
- Encode file to base64 (macOS: `base64 -i codesign-certificate.p12 | pbcopy`, Linux: `base64 codesign-certificate.p12 >
  codesign-certificate.txt`).
- Set `CSC_LINK` and `CSC_KEY_PASSWORD` environment variables. The base64 encoded value goes into `CSC_LINK` without change.
  - [Travis CI Settings](https://travis-ci.org/salomvary/soundcleod/settings)
  - [AppVeyor Settings](https://ci.appveyor.com/project/salomvary/soundcleod/settings/environment)
