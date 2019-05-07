import * as fs from "fs";
import * as path from "path";
import config from "./config";

/*
************ Instructions ************
1. Read all the files with particular ext or not in all the possible directory
2. While going through each of the file check for all the bad words and write them into result.log with line number where word(s) found
3. Check if path exists or not
*/
let listOfDirsToCheck = config.dirLists;
let listOfExtToScan = config.extToScan;
let listOfBadWords = config.badWordLists;

function scanDirRecursively(dir) {
    try {
        if (fs.lstatSync(dir).isDirectory()) {
            let dirsOrFiles = fs.readdirSync(dir);
            dirsOrFiles.forEach((dirOrFile) => {
                scanDirRecursively(path.join(dir, dirOrFile), listOfDirsToCheck, listOfExtToScan );
            });
        } else {
            if (listOfExtToScan.includes(path.extname(path.basename(dir)))) {
                let fileContent = fs.readFileSync(dir);
                listOfBadWords.forEach((badWord) => {
                    let regex = new RegExp(badWord, 'gi');
                    let regexArray;
                    while ((regexArray = regex.exec(fileContent.toString())) !== null) {
                        console.log(`Found word "${regexArray[0]}" at position ${regexArray['index']} in file ${dir}`);
                        fs.appendFileSync(path.join(__dirname, "../result/result.log"),
                            `${new Date()} Found "${regexArray[0]}" at position ${regexArray['index']} in file ${dir}\n`
                        );
                    }
                })
            } else {
                console.log(path.basename(dir), " - NO EXT FOUND");
            }
        }
    } catch (error) {
        console.log(error);
        console.log('Please check path : ',error.path);
    }
}

/*
* Create log dir and log file
*/
if (!fs.existsSync(path.join(__dirname, "../result"))) {
    try {
        fs.mkdirSync(path.join(__dirname, "../result"))
    } catch (error) {
        console.log("Failed to create result directory/file");
    }
}
/*
* Delete previous log file
*/
if (fs.existsSync(path.join(__dirname, "../result/result.log"))) {
    try {
        fs.unlinkSync(path.join(__dirname, "../result/result.log"))
    } catch (error) {
        console.log("Failed to delete previous result file");
    }
}
listOfDirsToCheck.forEach((eachDir) => {
    scanDirRecursively(eachDir);
})
