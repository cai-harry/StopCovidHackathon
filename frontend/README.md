# 1. Set-up

Ensure your version of npm is atleast 5.2

```$ npm --version```

If not, run:

```$ sudo apt-get update```

```$ sudo apt-get install build-essential checkinstall libssl-dev```

```$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash```

Install the specific version you want (I used 12.16.3)

```$ nvm install #.#.#```

You can tell nvm which version to use in each new shell with ```$ nvm use #.#.#``` and set a default with ```$ nvm alias default node```.

# 2. Install dependencies

```$ cd my-app```

```$ npm install```


# 3. Run the front-end

```$ npm start```

Also ensure you have the Chrome CORS plugin installed and enabled.

# 4. Run the back-end

See back-end README for instructions
