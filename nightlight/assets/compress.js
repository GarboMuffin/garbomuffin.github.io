const fs = require("fs");
const { execSync } = require("child_process");

function recurse(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.log("failed to read " + folder + ": " + err.stack);
      return;
    }

    const folders = files.filter(i => i.indexOf(".") === -1);
    const images = files.filter(i => i.indexOf(".png") > -1);

    images.forEach(i => {
      const f = folder + i;
      const command = `magick convert -strip -interpolate Nearest -filter point ${f} ${f}`;
      console.log("converting " + f);
      execSync(command);
    });

    folders.forEach(i => {
      const dir = folder + i + "/";
      console.log("reading directory " + dir);
      recurse(dir);
    });
  });
}

recurse("./");
