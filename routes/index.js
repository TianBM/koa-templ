const router = require('koa-router')()
const fs = require('fs')
const path = require('path')

function appendFileToRouter(file, filePath){
  const file_name = file.substr(0, file.length - 3);

  const file_entity = require(path.join(__dirname, filePath, file));

  fs.access(path.join(__dirname, filePath, file), err => {
    if(!err){
      if (file_name !== 'index') {
        router.use(path.join('/', filePath), file_entity.routes(), file_entity.allowedMethods());
      }
    }
  })
}

function digFolders(filePath) {
  const files = fs.readdirSync(path.join(__dirname, filePath));

  files
    .forEach(file => {

      const file_name = file.substr(0, file.length - 3);

      if (file_name !== 'index') {

        const realPath = path.join(__dirname, filePath, file)

        if (fs.lstatSync(realPath).isFile()) {
          appendFileToRouter(file, filePath);
        } else if (fs.lstatSync(realPath).isDirectory()) {
          digFolders(path.join(filePath, file));
        }

      }
    })
}

digFolders('')

module.exports = router