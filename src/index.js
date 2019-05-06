import * as fs from "fs";
import * as path from "path";
import config from "./config";

/*
************ Instructions ************
1. Read all the files with particular ext or not in all the possible directory
2. While going through each of the file check for all the bad words and write them into result.log with line number where word(s) found
3. Check if path exists or not
*/

function scanThroughDir(dir) {
    try {
        if (fs.lstatSync(dir).isDirectory()) {
            console.log(dir, true);
            let dirsOrFiles = fs.readdirSync(dir);
            dirsOrFiles.forEach((dirOrFile) => {
                scanThroughDir(path.join(dir, dirOrFile));
            });
        } else {
            console.log(dir, false)
        }
    } catch (error) {
        console.log('Please check path : ',error.path);
    }
}

let listOfDirsToCheck = config.dirLists;
listOfDirsToCheck.forEach((eachDir) => {
    scanThroughDir(eachDir);
})
