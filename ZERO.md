
### Source Control
Install Git source control, learn these commands at command prompt:

- `git clone`
- What `.gitignore` file does
- `git add .`
- `git commit -a -m "commit message"`
- `git remote -v`
- Create a new repository on github.
- `git remote add origin "git-url"`
- `git push`
- `git pull`

### Node.js

Install Node.js Javascript environment, Yarn package manager, learn these commands:

- `node` opens the repl, where you can execute javascript code.
- Open a new file `test.js`, write `console.log('hello world')` exit then run `node test.js`, see the hello world output on the console.
- Learn Javascript basic syntax.
- Install Yarn Package Manager.
- `yarn global add http-server`. Install a node package named http-server, so its available globally. 
- `http-server -p3000`. Runs the newly added package, starts listening on port 3000 you can browse to it in your browser, it will serve from your current directory. We will use this later.
- `yarn init`. Make a new directory `solid-test` inside run this command. Creates a package.json file that means, this folder is a javascript project that has a `node_modules` folder.
- Make src folder, edit `index.html` inside. Put some basic html. Learn basic html syntax.
- Make `index.js` file in src folder. Put `console.log('hello world')`. Include this file from `index.html` as a script tag.
- `http-server -p3000` in src folder, Open up developer tools, see the hello world in the console.
- `yarn add rollup --dev` in `solid-test` folder. This will install development dependency `rollup` lcally in `node_modules` folder.
- Add `node_modules/` to `.gitignore` file. This will ignore `node_modules` folder from source control so it doesn't get pushed to github.

### Homework

- Create a new repository on github. Commit your `solid-test` folder and push it to github.
- Go to your projects folders, Clone your newly created repository.
- `yarn install` on newly cloned repository, to install local dependencies.
- Add a README.md file, write some description. Add and commit the new file. Push it to github.


### Notes

- Use SSH method when working with github. Learn these commands:
- `ssh-keygen`, generate a new ssh key, name it `github_rsa`.
- `cat ~/.ssh/github_rsa.pub`. Add the newly created ssh key to github ssh keys via github site.
- `ssh-agent /bin/bash`. I don't exactly know why these commands necessary but they work.
- `ssh-add ~/.ssh/github_rsa`.
- Now your current terminal session can login (`git push` and `git pull`) to github without using password.
