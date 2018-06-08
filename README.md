# DropIt

<p align="center">
  <img width="150" height="150" src="https://github.com/ThalKod/DropIt/blob/master/public/img/logo.png"> </br>
  DropIt is a File Uploader built with nodejs
</p>

![alt text](https://github.com/ThalKod/DropIt/blob/master/public/img/Screen%20Shot%202018-06-08%20at%2010.36.39%20AM.png)


# :floppy_disk: Installation

```bash
# clone the repo
$ git clone https://github.com/ThalKod/DropIt.git

# install the requirements
$ npm install
```

## Usage
```bash
npm start
```

### Working with your own DB ? modify config.js :
```javascript
module.exports = {
    dbURL: process.env.DATABASEURL || "mongodb://localhost/dropit"
}
```
