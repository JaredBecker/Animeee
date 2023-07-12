<p  align="center">
    <img  src="https://raw.githubusercontent.com/JaredBecker/Animeee/master/src/assets/images/readme_logo.png" />
</p>

# Welcome to Animeee!

This is a site I've been working on in my spare time for fun and to learn new skills! The site is meant to be a [MAL](https://myanimelist.net/) clone but with fewer features. The site is currently still in development but I've been trying to add to it each day.

It's build using the following:
 - Angular & SCSS - Front-end
 - Firebase - Backend

# How do I preview the project?

 1. Download or  clone the **Master** repo
 2. Run `npm i` to install all dependencies
 3. Run `ng generate environments`. This will create your environment folder needed to store Firebase config.
 4. In the environments folder create `environment.development.ts` and `environment.production.ts`
 5. Now we need to tell Angular about these files so in your `angular.json` file under the `builds` property you will need to add a `fileReplace` rule for each build option, development and production. You just have to past this code in. Just be sure to update development to production when adding the property to that build option.
>     "fileReplacements": [{
>         "replace": "src/environments/environment.ts",
>         "with": "src/environments/environment.development.ts"
>     }]
6. Go to the `environment.ts` and add a `firebase` property to the file. Copy the exported const into your other 2 environment files
7. Now you need to create a Firebase project. When you do that it will give you a config object. Copy that and store it in the `firebase` property for each of the files.
